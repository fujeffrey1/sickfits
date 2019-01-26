import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import formatMoney from '../lib/formatMoney';
import RemoveFromCart from './RemoveFromCart';

const CartItem = ({ cartItem }) => {
    if (!cartItem.item)
        return (
            <ListItem>
                <ListItemText primary="This item has been removed" />
                <ListItemSecondaryAction>
                    <RemoveFromCart id={cartItem.id} />
                </ListItemSecondaryAction>
            </ListItem>
        );
    return (
        <ListItem divider>
            <ListItemAvatar>
                <Avatar alt={cartItem.item.title} src={cartItem.item.image} />
            </ListItemAvatar>
            <ListItemText
                primary={cartItem.item.title}
                secondary={`${formatMoney(cartItem.item.price * cartItem.quantity)} - ${
                    cartItem.quantity
                } x ${formatMoney(cartItem.item.price)} each`}
            />
            <ListItemSecondaryAction>
                <RemoveFromCart id={cartItem.id} />
            </ListItemSecondaryAction>
        </ListItem>
    );
};

CartItem.propTypes = {
    cartItem: PropTypes.object.isRequired
};

export default CartItem;
