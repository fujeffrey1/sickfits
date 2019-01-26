import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { format } from 'date-fns';
import Head from 'next/head';
import gql from 'graphql-tag';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import formatMoney from '../lib/formatMoney';
import Error from './Error';

const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY($id: ID!) {
        order(id: $id) {
            id
            charge
            total
            createdAt
            user {
                id
            }
            items {
                id
                title
                description
                price
                image
                quantity
            }
        }
    }
`;

const styles = theme => ({
    root: {
        width: '50vw',
        margin: '40px auto',
        padding: 20,
        borderTop: `8px solid ${theme.palette.secondary.light}`,
        textAlign: 'center',
        '& h6': {
            display: 'inline-block'
        }
    },
    divider: {
        margin: 10,
        '& + h6': {
            width: '15%',
            textAlign: 'right'
        },
        '& + h6 + h6': {
            paddingLeft: 15,
            width: '85%',
            textAlign: 'left'
        }
    },
    items: {
        width: '30vw',
        margin: 'auto',
        '& .order-item': {
            borderBottom: '1px solid #ccc',
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            alignItems: 'start',
            textAlign: 'start',
            gridGap: '2rem',
            margin: '2rem 0',
            paddingBottom: '2rem',
            '& img': {
                width: '100%',
                objectFit: 'cover'
            }
        }
    }
});

class Order extends Component {
    render() {
        const {
            classes: { root, divider, items },
            id
        } = this.props;

        return (
            <Query query={SINGLE_ORDER_QUERY} variables={{ id }}>
                {({ data, error, loading }) => {
                    if (error) return <Error error={error} />;
                    if (loading) return 'Loading...';
                    const order = data.order;
                    return (
                        <Paper className={root}>
                            <Head>
                                <title>Sick Fits - Order {order.id}</title>
                            </Head>
                            <Divider className={divider} />
                            <Typography variant="subtitle2">Order ID:</Typography>
                            <Typography variant="subtitle2">{id}</Typography>
                            <Divider className={divider} />
                            <Typography variant="subtitle2">Charge:</Typography>
                            <Typography variant="subtitle2">{order.charge}</Typography>
                            <Divider className={divider} />
                            <Typography variant="subtitle2">Date:</Typography>
                            <Typography variant="subtitle2">
                                {format(order.createdAt, 'MMMM D, YYYY h:mm a')}
                            </Typography>
                            <Divider className={divider} />
                            <Typography variant="subtitle2">Order Total:</Typography>
                            <Typography variant="subtitle2">{formatMoney(order.total)}</Typography>
                            <Divider className={divider} />
                            <Typography variant="subtitle2">Item Count:</Typography>
                            <Typography variant="subtitle2">{order.items.length}</Typography>
                            <Divider className={divider} />
                            <div className={items}>
                                {order.items.map(item => (
                                    <div className="order-item" key={item.id}>
                                        <img src={item.image} alt={item.title} />
                                        <div className="item-details">
                                            <Typography variant="h5">{item.title}</Typography>
                                            <Typography variant="body2">Quantity: {item.quantity}</Typography>
                                            <Typography variant="body2">Each: {formatMoney(item.price)}</Typography>
                                            <Typography variant="body2">
                                                Subtotal: {formatMoney(item.price * item.quantity)}
                                            </Typography>
                                            <Typography variant="body2">{item.description}</Typography>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Paper>
                    );
                }}
            </Query>
        );
    }
}

Order.propTypes = {
    id: PropTypes.string.isRequired
};

export default withStyles(styles)(Order);
