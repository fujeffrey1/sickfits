import React from 'react';
import { Query } from 'react-apollo';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';

const PleaseSignIn = props => {
    return (
        <Query query={CURRENT_USER_QUERY}>
            {({ loading, data }) => {
                if (loading) return 'Loading...';
                if (!data.me)
                    return (
                        <div style={{ marginTop: '30px' }}>
                            <Typography variant="title" align="center">
                                Please Sign in before continuing
                            </Typography>
                            <Grid container justify="center">
                                <Signin />
                            </Grid>
                        </div>
                    );
                return props.children;
            }}
        </Query>
    );
};

export default PleaseSignIn;
