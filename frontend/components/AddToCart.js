import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';

import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
    mutation ADD_TO_CART_MUTATION($id: ID!) {
        addToCart(id: $id) {
            id
            quantity
        }
    }
`;

class AddToCart extends Component {
    render() {
        const { id } = this.props;
        return (
            <Mutation
                mutation={ADD_TO_CART_MUTATION}
                variables={{ id }}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(addToCart, { loading }) => (
                    <Button size="small" color="primary" onClick={addToCart} disabled={loading}>
                        Add{loading && 'ing'} To Cart
                    </Button>
                )}
            </Mutation>
        );
    }
}

export default AddToCart;
