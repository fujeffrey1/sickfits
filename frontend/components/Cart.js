import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

import User from './User';
import CartItem from './CartItem';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import TakeMyMoney from './TakeMyMoney';

const LOCAL_STATE_QUERY = gql`
    query {
        cartOpen @client
    }
`;

const TOGGLE_CART_MUTATION = gql`
    mutation {
        toggleCart @client
    }
`;

const Composed = adopt({
    user: ({ render }) => <User>{render}</User>,
    toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
    localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const styles = theme => ({
    drawer: {
        width: 450
    },
    drawerHeader: {
        width: 450,
        display: 'flex'
    },
    headerIcon: {
        position: 'absolute'
    },
    headerText: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        padding: '5px 10px',
        margin: '5px auto'
    },
    drawerBody: {
        margin: '0 5%',
        padding: '0 20px',
        borderTop: '3px solid black'
    },
    drawerFooter: {
        borderTop: '5px double black',
        position: 'absolute',
        bottom: 0,
        margin: '5% 5% 0',
        padding: 20,
        width: '90%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    footerTotal: {
        fontWeight: 'bold',
        alignSelf: 'center'
    }
});

const Cart = ({ classes: { drawer, drawerHeader, headerIcon, headerText, drawerBody, drawerFooter, footerTotal } }) => {
    return (
        <Composed>
            {({ user, toggleCart, localState }) => {
                const me = user.data.me;
                if (!me) return null;
                return (
                    <Drawer variant="persistent" anchor="right" open={localState.data.cartOpen} className={drawer}>
                        <div className={drawerHeader}>
                            <IconButton onClick={toggleCart} className={headerIcon}>
                                <ChevronRightIcon />
                            </IconButton>
                            <Typography variant="h5" align="center" className={headerText}>
                                {me.name}'s Cart
                            </Typography>
                        </div>
                        <Typography variant="subtitle2" align="center" gutterBottom={true}>
                            You have {me.cart.length} item{me.cart.length === 1 ? '' : 's'} in your cart
                        </Typography>
                        <div className={drawerBody}>
                            <List dense={true}>
                                {me.cart.map(cartItem => (
                                    <CartItem key={cartItem.id} cartItem={cartItem}>
                                        {cartItem.id}
                                    </CartItem>
                                ))}
                            </List>
                        </div>
                        <div className={drawerFooter}>
                            <Typography variant="h5" className={footerTotal}>
                                {formatMoney(calcTotalPrice(me.cart))}
                            </Typography>
                            <TakeMyMoney>
                                <Button variant="contained" color="secondary" disabled={me.cart.length === 0}>
                                    CHECKOUT
                                </Button>
                            </TakeMyMoney>
                        </div>
                    </Drawer>
                );
            }}
        </Composed>
    );
};

Cart.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Cart);
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
