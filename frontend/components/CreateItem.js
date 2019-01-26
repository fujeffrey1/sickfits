import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
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

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(title: $title, description: $description, price: $price, image: $image, largeImage: $largeImage) {
            id
        }
    }
`;

class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        price: 0,
        image: '',
        largeImage: ''
    };

    handleChange = e => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;

        this.setState({ [name]: val });
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
            classes: { paper, image, button }
        } = this.props;

        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, { loading, error }) => (
                    <Paper className={paper}>
                        <form
                            data-test="form"
                            onSubmit={async e => {
                                e.preventDefault();
                                const res = await createItem();
                                Router.push({ pathname: '/item', query: { id: res.data.createItem.id } });
                            }}
                        >
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
                            {this.state.image && this.state.image !== 'loading' && (
                                <img src={this.state.image} className={image} alt="Upload Preview" />
                            )}
                            <TextField
                                required
                                fullWidth
                                id="title"
                                name="title"
                                label="Title"
                                margin="normal"
                                value={this.state.title}
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
                                value={this.state.price}
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
                                value={this.state.description}
                                onChange={this.handleChange}
                                disabled={loading}
                            />
                            <br />
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={loading || this.state.image === 'loading'}
                                className={button}
                            >
                                Submit
                            </Button>
                        </form>
                    </Paper>
                )}
            </Mutation>
        );
    }
}

CreateItem.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreateItem);
export { CREATE_ITEM_MUTATION };
