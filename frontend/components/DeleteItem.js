import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import { toast } from 'react-toastify';

import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION($id: ID!) {
        deleteItem(id: $id) {
            id
        }
    }
`;
class DeleteItem extends Component {
    update = (cache, { data: { deleteItem } }) => {
        const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
        data.items = data.items.filter(item => item.id !== deleteItem.id);
        cache.writeQuery({
            query: ALL_ITEMS_QUERY,
            data
        });
    };

    render() {
        return (
            <Mutation mutation={DELETE_ITEM_MUTATION} variables={{ id: this.props.id }} update={this.update}>
                {(deleteItem, { error }) => (
                    <div>
                        <Button
                            size="small"
                            color="primary"
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this item?'))
                                    deleteItem().catch(err => toast.error(err.message));
                            }}
                        >
                            {this.props.children}
                        </Button>
                    </div>
                )}
            </Mutation>
        );
    }
}

export default DeleteItem;
