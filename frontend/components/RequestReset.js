import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Error from './Error';
import styles from './styles/paper';

const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION($email: String!) {
        requestReset(email: $email) {
            message
        }
    }
`;

class RequestReset extends Component {
    state = {
        email: ''
    };

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    render() {
        const {
            classes: { paper, button }
        } = this.props;
        return (
            <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
                {(reset, { loading, error, called }) => (
                    <Paper className={paper}>
                        <form
                            method="post"
                            data-test="form"
                            onSubmit={async e => {
                                e.preventDefault();
                                await reset();
                                this.setState({ email: '' });
                            }}
                        >
                            <Fade in={loading} unmountOnExit>
                                <LinearProgress variant="indeterminate" aria-busy={loading} />
                            </Fade>
                            <br />
                            <Typography variant="h5">Request a Password Reset</Typography>
                            <Error error={error} />
                            {!error && !loading && called && (
                                <Typography variant="subtitle2">Success! Check your email for a reset link.</Typography>
                            )}
                            <TextField
                                required
                                fullWidth
                                name="email"
                                label="Email"
                                margin="normal"
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                disabled={loading}
                            />
                            <br />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={loading}
                                className={button}
                            >
                                Request Reset
                            </Button>
                        </form>
                    </Paper>
                )}
            </Mutation>
        );
    }
}

RequestReset.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RequestReset);
export { REQUEST_RESET_MUTATION };
