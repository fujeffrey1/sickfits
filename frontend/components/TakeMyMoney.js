import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import NProgress from 'nprogress';
import { toast } from 'react-toastify';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './Error';
import User, { CURRENT_USER_QUERY } from './User';
import Order from '../pages/order';

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION($token: String!) {
        createOrder(token: $token) {
            id
            charge
            total
            items {
                id
                title
            }
        }
    }
`;

function totalItems(cart) {
    return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class TakeMyMoney extends Component {
    onToken = async (res, createOrder) => {
        NProgress.start();
        const order = await createOrder({
            variables: {
                token: res.id
            }
        }).catch(err => toast.error(err.message));
        Router.push({
            pathname: '/order',
            query: {
                id: order.data.createOrder.id
            }
        });
    };

    render() {
        return (
            <User>
                {({ data: { me } }) => (
                    <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
                        {createOrder => (
                            <StripeCheckout
                                amount={calcTotalPrice(me.cart)}
                                name="Sick Fits"
                                description={`Order of ${totalItems(me.cart)} items!`}
                                image={me.cart[0] && me.cart[0].item.image}
                                stripeKey="pk_test_1KjRlt5SIsZRS4DjnYYzOS7D"
                                currency="USD"
                                email={me.email}
                                token={res => this.onToken(res, createOrder)}
                            >
                                {this.props.children}
                            </StripeCheckout>
                        )}
                    </Mutation>
                )}
            </User>
        );
    }
}

export default TakeMyMoney;
