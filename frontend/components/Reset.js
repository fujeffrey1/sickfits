import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { CURRENT_USER_QUERY } from './User';
import Error from './Error';
import styles from './styles/paper.js';

const RESET_MUTATION = gql`
    mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
        resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
            id
            email
            name
        }
    }
`;

class Reset extends Component {
    state = {
        password: '',
        confirmPassword: ''
    };

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    render() {
        const {
            classes: { paper, button },
            resetToken
        } = this.props;
        return (
            <Mutation
                mutation={RESET_MUTATION}
                variables={{
                    resetToken,
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword
                }}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(reset, { loading, error, called }) => (
                    <Grid container justify="center">
                        <Paper className={paper}>
                            <form
                                method="post"
                                onSubmit={async e => {
                                    e.preventDefault();
                                    await reset();
                                    this.setState({ password: '', confirmPassword: '' });
                                }}
                            >
                                <Fade in={loading} unmountOnExit>
                                    <LinearProgress variant="indeterminate" aria-busy={loading} />
                                </Fade>
                                <br />
                                <Typography variant="h5">Reset Your Password</Typography>
                                <Error error={error} />
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    margin="normal"
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    disabled={loading}
                                />
                                <br />
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    margin="normal"
                                    type="password"
                                    value={this.state.confirmPassword}
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
                                    Reset Your Password
                                </Button>
                            </form>
                        </Paper>
                    </Grid>
                )}
            </Mutation>
        );
    }
}

Reset.propTypes = {
    classes: PropTypes.object.isRequired,
    resetToken: PropTypes.string.isRequired
};

export default withStyles(styles)(Reset);
