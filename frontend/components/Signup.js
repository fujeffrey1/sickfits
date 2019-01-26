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

import { CURRENT_USER_QUERY } from './User';
import Error from './Error';
import styles from './styles/paper';

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
        signup(email: $email, name: $name, password: $password) {
            id
            email
            name
        }
    }
`;

class Signup extends Component {
    state = {
        email: '',
        name: '',
        password: ''
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
            <Mutation
                mutation={SIGNUP_MUTATION}
                variables={this.state}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(signup, { loading, error }) => (
                    <Paper className={paper}>
                        <form
                            method="post"
                            onSubmit={async e => {
                                e.preventDefault();
                                await signup();
                                this.setState({ name: '', email: '', password: '' });
                            }}
                        >
                            <Fade in={loading} unmountOnExit>
                                <LinearProgress variant="indeterminate" aria-busy={loading} />
                            </Fade>
                            <br />
                            <Typography variant="h5">Sign Up For An Account</Typography>
                            <Error error={error} />
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
                            <TextField
                                required
                                fullWidth
                                name="name"
                                label="Name"
                                margin="normal"
                                value={this.state.name}
                                onChange={this.handleChange}
                                disabled={loading}
                            />
                            <br />
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
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={loading}
                                className={button}
                            >
                                Sign Up
                            </Button>
                        </form>
                    </Paper>
                )}
            </Mutation>
        );
    }
}

Signup.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Signup);
