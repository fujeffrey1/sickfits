import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { toast } from 'react-toastify';

import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
    mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
        removeFromCart(id: $id) {
            id
        }
    }
`;

class RemoveFromCart extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    };

    update = (cache, { data: { removeFromCart } }) => {
        const data = cache.readQuery({ query: CURRENT_USER_QUERY });
        const cartItemId = removeFromCart.id;
        data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
        cache.writeQuery({
            query: CURRENT_USER_QUERY,
            data
        });
    };

    render() {
        return (
            <Mutation
                mutation={REMOVE_FROM_CART_MUTATION}
                variables={{ id: this.props.id }}
                update={this.update}
                optimisticResponse={{
                    __typename: 'Mutation',
                    removeFromCart: {
                        __typename: 'CartItem',
                        id: this.props.id
                    }
                }}
            >
                {(removeFromCart, { loading, error }) => (
                    <div>
                        <IconButton disabled={loading}>
                            <DeleteIcon
                                onClick={() => {
                                    removeFromCart().catch(err => toast.error(err.message));
                                }}
                            />
                        </IconButton>
                    </div>
                )}
            </Mutation>
        );
    }
}

export default RemoveFromCart;
