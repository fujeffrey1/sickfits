import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import Error from './Error';
import styles from './styles/item_form';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            price
            image
            largeImage
        }
    }
`;

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $price: Int
        $image: String
        $largeImage: String
    ) {
        updateItem(
            id: $id
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
            title
            description
            price
            image
            largeImage
        }
    }
`;

class UpdateItem extends Component {
    state = {};

    handleChange = e => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;

        this.setState({ [name]: val });
    };

    updateItem = async (e, updateItemMutation) => {
        e.preventDefault();
        if (this.state.image !== 'loading') {
            const res = await updateItemMutation({
                variables: { id: this.props.id, ...this.state }
            });
        }
    };

    uploadFile = async e => {
        this.setState({ image: 'loading' });
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');
        const res = await fetch('https://api.cloudinary.com/v1_1/fujeffrey1/image/upload', {
            method: 'POST',
            body: data
        });
        const file = await res.json();
        this.setState({ image: file.secure_url });
        this.setState({ largeImage: file.eager[0].secure_url });
    };

    render() {
        const {
            classes: { paper, image, button },
            id
        } = this.props;

        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{ id: id }}>
                {({ loading, data }) => {
                    if (loading) return 'Loading...';
                    if (!data.item) return `No Item Found for ID: ${id}`;
                    return (
                        <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                            {(updateItem, { loading, error }) => (
                                <Paper className={paper}>
                                    <form onSubmit={e => this.updateItem(e, updateItem)}>
                                        <Error error={error} />
                                        <Fade in={loading} unmountOnExit>
                                            <LinearProgress variant="indeterminate" aria-busy={loading} />
                                        </Fade>
                                        <br />
                                        <input hidden id="image" name="image" type="file" onChange={this.uploadFile} />
                                        <label htmlFor="image">
                                            <Button color="primary" component="span" variant="contained">
                                                Upload
                                            </Button>
                                        </label>
                                        {(this.state.image || data.item.image) && this.state.image !== 'loading' && (
                                            <img
                                                src={this.state.image ? this.state.image : data.item.image}
                                                className={image}
                                                alt="Upload Preview"
                                            />
                                        )}
                                        <TextField
                                            required
                                            fullWidth
                                            id="title"
                                            name="title"
                                            label="Title"
                                            margin="normal"
                                            defaultValue={data.item.title}
                                            onChange={this.handleChange}
                                            disabled={loading}
                                        />
                                        <br />
                                        <TextField
                                            required
                                            fullWidth
                                            id="price"
                                            name="price"
                                            label="Price"
                                            margin="normal"
                                            type="number"
                                            defaultValue={data.item.price}
                                            onChange={this.handleChange}
                                            disabled={loading}
                                        />
                                        <br />
                                        <TextField
                                            required
                                            fullWidth
                                            multiline
                                            id="description"
                                            name="description"
                                            label="Description"
                                            margin="normal"
                                            variant="outlined"
                                            rows="4"
                                            defaultValue={data.item.description}
                                            onChange={this.handleChange}
                                            disabled={loading}
                                        />
                                        <br />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={loading}
                                            type="submit"
                                            className={button}
                                        >
                                            Sav{loading ? 'ing' : 'e'} Changes
                                        </Button>
                                    </form>
                                </Paper>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}

UpdateItem.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UpdateItem);
export { UPDATE_ITEM_MUTATION };
