import React from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Tab from '@material-ui/core/Tab';

import { CURRENT_USER_QUERY } from './User';

const SIGNOUT_MUTATION = gql`
    mutation SIGNOUT_MUTATION {
        signout {
            message
        }
    }
`;

const Signout = props => {
    return (
        <Mutation
            mutation={SIGNOUT_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            onCompleted={() => Router.push('/signup')}
        >
            {signout => <Tab label="Sign Out" onClick={signout} />}
        </Mutation>
    );
};

export default Signout;
