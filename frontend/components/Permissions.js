import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Error from './Error';

const ALL_USERS_QUERY = gql`
    query {
        users {
            id
            name
            email
            permissions
        }
    }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation UPDATE_PERMISSIONS_MUTATION($permissions: [Permission], $userId: ID!) {
        updatePermissions(permissions: $permissions, userId: $userId) {
            id
            permissions
            name
            email
        }
    }
`;

const styles = {
    root: {
        margin: '30px 100px',
        padding: '30px 50px 75px'
    }
};

const possiblePermissions = ['ADMIN', 'USER', 'ITEMCREATE', 'ITEMUPDATE', 'ITEMDELETE', 'PERMISSIONUPDATE'];

const Permissions = ({ classes: { root } }) => {
    return (
        <Query query={ALL_USERS_QUERY}>
            {({ loading, error, data }) => (
                <div className={root}>
                    <Error error={error} />
                    <div>
                        <Typography variant="h5" gutterBottom={true}>
                            Manage User Permissions
                        </Typography>
                        <Paper>
                            <Table padding="dense">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        {possiblePermissions.map(permission => (
                                            <TableCell key={permission} style={{ textAlign: 'center' }}>
                                                {permission}
                                            </TableCell>
                                        ))}
                                        <TableCell>Update</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.users.map(user => (
                                        <UserPermissions user={user} key={user.id} />
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                </div>
            )}
        </Query>
    );
};

class UserPermissions extends Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permissions: PropTypes.array
        }).isRequired
    };

    state = {
        permissions: this.props.user.permissions
    };

    handlePermissionChange = e => {
        const checkbox = e.target;
        let updatedPermissions = [...this.state.permissions];
        if (checkbox.checked) {
            updatedPermissions.push(checkbox.value);
        } else {
            updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value);
        }
        this.setState({ permissions: updatedPermissions });
    };

    render() {
        const user = this.props.user;
        return (
            <Mutation
                mutation={UPDATE_PERMISSIONS_MUTATION}
                variables={{
                    permissions: this.state.permissions,
                    userId: this.props.user.id
                }}
            >
                {(updatePermissions, { loading, error }) => (
                    <>
                        {error && (
                            <TableRow>
                                <TableCell colSpan="9">
                                    <Error error={error} />
                                </TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            {possiblePermissions.map(permission => (
                                <TableCell key={permission} style={{ textAlign: 'center' }}>
                                    <Checkbox
                                        checked={this.state.permissions.includes(permission)}
                                        value={permission}
                                        onChange={this.handlePermissionChange}
                                    />
                                </TableCell>
                            ))}
                            <TableCell>
                                <Button disabled={loading} onClick={updatePermissions}>
                                    Updat{loading ? 'ing' : 'e'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    </>
                )}
            </Mutation>
        );
    }
}

export default withStyles(styles)(Permissions);
