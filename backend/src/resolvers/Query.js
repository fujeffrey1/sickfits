const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, context, info) {
        if (!context.req.userId) {
            return null;
        }
        return context.db.query.user({ where: { id: context.req.userId } }, info);
    },
    async users(parent, args, context, info) {
        if (!context.req.userId) throw new Error('You must be logged in to do that!');

        hasPermission(context.req.user, ['ADMIN', 'PERMISSIONUPDATE']);
        return context.db.query.users({}, info);
    },
    async order(parent, args, context, info) {
        if (!context.req.userId) throw new Error('You must be logged in to do that!');

        const order = await context.db.query.order({ where: { id: args.id } }, info);
        const ownsOrder = order.user.id === context.req.userId;
        const hasPermissionToSeeOrder = context.req.user.permissions.includes('ADMIN');
        if (!ownsOrder || !hasPermissionToSeeOrder) throw new Error('You cant see this!');

        return order;
    },
    async orders(parent, args, context, info) {
        const { userId } = context.req;
        if (!userId) throw new Error('You must be logged in to do that!');

        return context.db.query.orders(
            {
                where: {
                    user: { id: userId }
                }
            },
            info
        );
    }
};

module.exports = Query;
