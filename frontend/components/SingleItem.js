import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Error from './Error';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            largeImage
        }
    }
`;

const styles = {
    root: {
        textAlign: 'center',
        padding: '20px 40px'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
    },
    paper: {
        height: '100%',
        padding: 20
    }
};

class SingleItem extends Component {
    render() {
        const {
            classes: { root, image, paper }
        } = this.props;

        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return <Error error={error} />;
                    if (!data.item) return `No Item Found for ID: ${this.props.id}`;
                    const item = data.item;
                    return (
                        <Grid container spacing={16} className={root}>
                            <Head>
                                <title>Sick Fits | {item.title}</title>
                            </Head>
                            <Grid item sm={6}>
                                <img src={item.largeImage} alt={item.title} className={image} />
                            </Grid>
                            <Grid item sm={6}>
                                <Paper className={paper}>
                                    <Typography variant="h4">Viewing {item.title}</Typography>
                                    <p>{item.description}</p>
                                </Paper>
                            </Grid>
                        </Grid>
                    );
                }}
            </Query>
        );
    }
}

SingleItem.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SingleItem);
export { SINGLE_ITEM_QUERY };
