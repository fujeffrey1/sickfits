import React from 'react';
import Grid from '@material-ui/core/Grid';

import Signup from '../components/Signup';
import Signin from '../components/Signin';
import RequestReset from '../components/RequestReset';

const SignupPage = props => {
    return (
        <Grid container spacing={24} justify="center">
            <Signup />
            <Signin />
            <RequestReset />
        </Grid>
    );
};

export default SignupPage;
