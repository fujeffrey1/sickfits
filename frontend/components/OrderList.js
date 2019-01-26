import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import formatMoney from '../lib/formatMoney';
import Error from './Error';

const USER_ORDERS_QUERY = gql`
    query USER_ORDERS_QUERY {
        orders(orderBy: createdAt_DESC) {
            id
            total
            createdAt
            items {
                id
                title
                image
            }
        }
    }
`;

const styles = theme => ({
    root: {
        width: '50vw',
        margin: '40px auto'
    },
    paper: {
        padding: 30,
        cursor: 'pointer',
        marginBottom: 15,
        borderLeft: `8px solid ${theme.palette.secondary.light}`
    },
    images: {
        display: 'grid',
        gridGap: 10,
        gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
        marginTop: '1rem',
        '& img': {
            height: 200,
            objectFit: 'contain',
            width: '100%'
        }
    }
});

class OrderList extends Component {
    render() {
        const {
            classes: { root, paper, images }
        } = this.props;

        return (
            <Query query={USER_ORDERS_QUERY}>
                {({ data: { orders }, error, loading }) => {
                    if (loading) return 'Loading...';
                    if (error) return <Error error={error} />;
                    return (
                        <div className={root}>
                            <Typography variant="title" gutterBottom={true}>
                                You have {orders.length} orders
                            </Typography>
                            <div className={root}>
                                {orders.map(order => (
                                    <Paper
                                        key={order.id}
                                        className={paper}
                                        onClick={() => Router.push({ pathname: '/order', query: { id: order.id } })}
                                    >
                                        <Typography variant="subtitle1" style={{ display: 'inline-block' }}>
                                            {order.items.length} product{order.items.length === 1 ? '' : 's'} for{' '}
                                            {formatMoney(order.total)}
                                        </Typography>
                                        <Typography variant="body2" style={{ display: 'inline-block', float: 'right' }}>
                                            {distanceInWordsToNow(order.createdAt)} ago
                                        </Typography>
                                        <div className={images}>
                                            {order.items.map(item => (
                                                <img key={item.id} src={item.image} alt={item.title} />
                                            ))}
                                        </div>
                                    </Paper>
                                ))}
                            </div>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

OrderList.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OrderList);
