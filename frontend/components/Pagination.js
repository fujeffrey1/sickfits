import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import MobileStepper from '@material-ui/core/MobileStepper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { perPage } from '../config';

const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`;

const styles = {
    stepper: {
        maxWidth: 500,
        margin: 'auto',
        padding: 0
    },
    helper: {
        margin: '0 0 40px'
    }
};

const Pagination = ({ page, classes: { stepper, helper } }) => {
    return (
        <Query query={PAGINATION_QUERY}>
            {({ loading, error, data }) => {
                if (loading) return 'Loading...';
                const count = data.itemsConnection.aggregate.count;
                const pages = Math.ceil(count / perPage);
                return (
                    <div data-test="pagination">
                        <Head>
                            <title>
                                Sick Fits! - Page {page} of {pages}
                            </title>
                        </Head>
                        <Typography align="center" variant="subtitle1">
                            {count} Items Total
                        </Typography>
                        <MobileStepper
                            variant="progress"
                            position="static"
                            className={stepper}
                            steps={pages}
                            activeStep={page - 1}
                            nextButton={
                                <Link prefetch href={{ pathname: '/items', query: { page: page + 1 } }}>
                                    <Button size="small" disabled={page >= pages}>
                                        Next
                                    </Button>
                                </Link>
                            }
                            backButton={
                                <Link prefetch href={{ pathname: '/items', query: { page: page - 1 } }}>
                                    <Button size="small" disabled={page <= 1}>
                                        Back
                                    </Button>
                                </Link>
                            }
                        />
                        <Typography align="center" variant="subtitle2" className={helper}>
                            Page {page} of <span className="totalPages">{pages}</span>
                        </Typography>
                    </div>
                );
            }}
        </Query>
    );
};

Pagination.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Pagination);
export { PAGINATION_QUERY };
