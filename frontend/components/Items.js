import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Item from './Item';
import Pagination from './Pagination';
import Error from './Error';
import { perPage } from '../config';

const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int= ${perPage}) {
        items(skip: $skip, first: $first, orderBy: createdAt_DESC) {
            id
            title
            price
            description
            image
            largeImage
        }
    }
`;

const styles = {
    root: {
        textAlign: 'center',
        padding: '20px 40px'
    }
};

class Items extends Component {
    render() {
        const {
            classes: { root },
            page
        } = this.props;

        return (
            <div className={root}>
                <Pagination page={page} />
                <Query query={ALL_ITEMS_QUERY} variables={{ skip: (page - 1) * perPage }}>
                    {({ loading, error, data }) => {
                        if (loading) return 'Loading...';
                        if (error) return <Error error={error} />;
                        return (
                            <Grid container spacing={24}>
                                {data.items.map(item => (
                                    <Item item={item} key={item.id} />
                                ))}
                            </Grid>
                        );
                    }}
                </Query>
            </div>
        );
    }
}

Items.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Items);
export { ALL_ITEMS_QUERY };
