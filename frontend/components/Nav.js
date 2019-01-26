import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import User from './User';
import Signout from './Signout';
import CartCount from './CartCount';
import { withStyles } from '@material-ui/core/styles';
import { TOGGLE_CART_MUTATION } from './Cart';

const styles = theme => ({
    responsive: {
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            padding: 1.5 * theme.spacing.unit
        }
    },
    grow: {
        flexGrow: 1,
        [theme.breakpoints.down('md')]: {
            marginBottom: 10
        }
    },
    logo: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        display: 'inline',
        fontWeight: 'bold',
        padding: '5px 10px',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    tabs: {
        textAlign: 'right'
    },
    fixed: {
        overflowX: 'visible'
    },
    hidden: {
        display: 'none'
    },
    root: {
        '@media (min-width: 960px)': {
            minWidth: 0
        }
    }
});

class Nav extends Component {
    render() {
        const {
            classes: { responsive, grow, logo, tabs, fixed, hidden, root },
            pathname
        } = this.props;

        return (
            <AppBar position="static" color="primary">
                <Toolbar className={responsive} data-test="nav">
                    >
                    <div className={grow}>
                        <Typography variant="h5" className={logo} onClick={() => Router.push('/')}>
                            Sick Fits
                        </Typography>
                    </div>
                    <User>
                        {({ data: { me } }) => (
                            <Tabs
                                className={tabs}
                                classes={{ fixed }}
                                value={
                                    pathname === '/signup'
                                        ? 4
                                        : pathname === '/account'
                                        ? 3
                                        : pathname === '/orders'
                                        ? 2
                                        : pathname === '/sell'
                                        ? 1
                                        : 0
                                }
                            >
                                <Tab label="Shop" onClick={() => Router.push('/items')} classes={{ root }} />
                                <Tab
                                    label="Sell"
                                    onClick={() => Router.push('/sell')}
                                    className={!me ? hidden : null}
                                    classes={{ root }}
                                />
                                <Tab
                                    label="Orders"
                                    onClick={() => Router.push('/orders')}
                                    className={!me ? hidden : null}
                                    classes={{ root }}
                                />
                                <Tab
                                    label="Account"
                                    onClick={() => Router.push('/account')}
                                    className={!me ? hidden : null}
                                    classes={{ root }}
                                />
                                {me ? <Signout /> : <Tab label="Signin" onClick={() => Router.push('/signup')} />}
                                {me && (
                                    <Mutation mutation={TOGGLE_CART_MUTATION}>
                                        {toggleCart => (
                                            <Button onClick={toggleCart} color="inherit">
                                                My Cart
                                                <CartCount
                                                    count={me.cart.reduce(
                                                        (tally, cartItem) => tally + cartItem.quantity,
                                                        0
                                                    )}
                                                />
                                            </Button>
                                        )}
                                    </Mutation>
                                )}
                            </Tabs>
                        )}
                    </User>
                </Toolbar>
            </AppBar>
        );
    }
}

Nav.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Nav);
