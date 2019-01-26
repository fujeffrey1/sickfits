const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
const { hasPermission } = require('../utils');
const stripe = require('../stripe');

const Mutation = {
    async createItem(parent, args, context, info) {
        if (!context.req.userId) throw new Error('You must be logged in to do that!');

        const item = await context.db.mutation.createItem(
            {
                data: {
                    ...args,
                    user: {
                        connect: {
                            id: context.req.userId
                        }
                    }
                }
            },
            info
        );

        return item;
    },
    updateItem(parent, args, context, info) {
        const updates = { ...args };
        delete updates.id;
        return context.db.mutation.updateItem(
            {
                data: updates,
                where: { id: args.id }
            },
            info
        );
    },
    async deleteItem(parent, args, context, info) {
        const where = { id: args.id };
        const item = await context.db.query.item({ where }, `{id title user { id }}`);
        const ownsItem = item.user.id === context.req.userId;
        const hasPermissions = context.req.user.permissions.some(permission =>
            ['ADMIN', 'ITEMDELETE'].includes(permission)
        );
        if (!ownsItem && !hasPermissions) throw new Error("You don't have the permissions to do that!");
        return context.db.mutation.deleteItem({ where }, info);
    },
    async signup(parent, args, context, info) {
        args.email = args.email.toLowerCase();
        const password = await bcrypt.hash(args.password, 10);
        const user = await context.db.mutation.createUser(
            {
                data: { ...args, password, permissions: { set: ['USER'] } }
            },
            info
        );

        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        storeJWT(context, token);

        return user;
    },
    async signin(parent, { email, password }, context, info) {
        const user = await context.db.query.user({ where: { email } });
        if (!user) throw new Error(`No such user found for email ${email}`);

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid Password!');

        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        storeJWT(context, token);

        return user;
    },
    signout(parent, args, context, info) {
        context.res.clearCookie('token');
        return { message: 'Goodbye!' };
    },
    async requestReset(parent, { email }, context, info) {
        const user = await context.db.query.user({ where: { email } });
        if (!user) throw new Error(`No such user found for email ${email}`);

        const resetToken = (await promisify(randomBytes)(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour
        const res = await context.db.mutation.updateUser({ where: { email }, data: { resetToken, resetTokenExpiry } });

        const mailRes = await transport.sendMail({
            from: 'fujeffrey1@gmail.com',
            to: user.email,
            subject: 'Your Password Reset Token',
            html: makeANiceEmail(
                `Your Password Reset Token is here! \n\n <a href="${
                    process.env.FRONTEND_URL
                }/reset?resetToken=${resetToken}">Click Here to Reset</a>`
            )
        });
        return { message: 'Thanks!' };
    },
    async resetPassword(parent, { resetToken, password, confirmPassword }, context, info) {
        if (password !== confirmPassword) throw new Error("Your passwords don't match");
        const [user] = await context.db.query.users({
            where: { resetToken, resetTokenExpiry_gte: Date.now() - 3600000 }
        });

        if (!user) throw new Error('This token is either invalid or expired!');
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await context.db.mutation.updateUser({
            where: { email: user.email },
            data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null }
        });

        const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
        storeJWT(context, token);

        return updatedUser;
    },
    async updatePermissions(parent, args, context, info) {
        if (!context.req.userId) throw new Error('You must be logged in to do that!');

        hasPermission(context.req.user, ['ADMIN', 'PERMISSIONUPDATE']);
        return context.db.mutation.updateUser(
            {
                data: {
                    permissions: {
                        set: args.permissions
                    }
                },
                where: {
                    id: args.userId
                }
            },
            info
        );
    },
    async addToCart(parent, args, context, info) {
        const { userId } = context.req;
        if (!userId) throw new Error('You must be logged in to do that!');

        const [existingCartItem] = await context.db.query.cartItems({
            where: {
                user: { id: userId },
                item: { id: args.id }
            }
        });

        if (existingCartItem) {
            return context.db.mutation.updateCartItem(
                {
                    where: { id: existingCartItem.id },
                    data: {
                        quantity: existingCartItem.quantity + 1
                    }
                },
                info
            );
        }

        return context.db.mutation.createCartItem(
            {
                data: {
                    user: {
                        connect: { id: userId }
                    },
                    item: {
                        connect: { id: args.id }
                    }
                }
            },
            info
        );
    },
    async removeFromCart(parent, args, context, info) {
        const cartItem = await context.db.query.cartItem({ where: { id: args.id } }, `{id user {id}}`);

        if (!cartItem) throw new Error('No Cart Item Found!');
        if (cartItem.user.id !== context.req.userId) throw new Error("You can't do that!");

        return context.db.mutation.deleteCartItem({ where: { id: args.id } }, info);
    },
    async createOrder(parent, args, context, info) {
        const { userId } = context.req;
        if (!userId) throw new Error('You must be logged in to do that!');
        const user = await context.db.query.user(
            { where: { id: userId } },
            `{id name email cart { id quantity item { title price id description image largeImage}}}`
        );

        const amount = user.cart.reduce((tally, cartItem) => tally + cartItem.item.price * cartItem.quantity, 0);
        const charge = await stripe.charges.create({
            amount,
            currency: 'USD',
            source: args.token
        });

        const orderItems = user.cart.map(cartItem => {
            const orderItem = {
                ...cartItem.item,
                quantity: cartItem.quantity,
                user: { connect: { id: userId } }
            };
            delete orderItem.id;
            return orderItem;
        });

        const order = await context.db.mutation.createOrder({
            data: {
                total: charge.amount,
                charge: charge.id,
                items: { create: orderItems },
                user: { connect: { id: userId } }
            }
        });

        const cartItemIds = user.cart.map(cartItem => cartItem.id);
        await context.db.mutation.deleteManyCartItems({ where: { id_in: cartItemIds } });

        return order;
    }
};

function storeJWT(context, token) {
    context.res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365
    });
}

module.exports = Mutation;
