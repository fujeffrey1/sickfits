import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import gql from 'graphql-tag';
import Downshift, { resetIdCounter } from 'downshift';
import { ApolloConsumer } from 'react-apollo';
import debounce from 'lodash/debounce';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY($searchTerm: String!) {
        items(where: { OR: [{ title_contains: $searchTerm }, { description_contains: $searchTerm }] }) {
            id
            image
            title
        }
    }
`;

const styles = theme => ({
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0
    },
    selected: {
        paddingLeft: 25,
        transition: 'all 0.3s',
        borderLeft: `8px solid ${theme.palette.secondary.light}`
    }
});

function routeToItem(item) {
    Router.push({
        pathname: '/item',
        query: {
            id: item.id
        }
    });
}

class AutoComplete extends Component {
    state = {
        items: [],
        loading: false
    };

    onChange = debounce(async (e, client) => {
        this.setState({ loading: true });
        const res = await client.query({
            query: SEARCH_ITEMS_QUERY,
            variables: { searchTerm: e.target.value }
        });
        this.setState({ items: res.data.items, loading: false });
    }, 400);

    render() {
        resetIdCounter();

        const {
            classes: { paper, selected }
        } = this.props;

        return (
            <div>
                <Downshift itemToString={item => (item === null ? '' : item.title)} onChange={routeToItem}>
                    {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
                        <div>
                            <ApolloConsumer>
                                {client => (
                                    <TextField
                                        fullWidth
                                        {...getInputProps({
                                            id: 'search',
                                            type: 'search',
                                            placeholder: 'Search For An Item',
                                            onChange: e => {
                                                e.persist();
                                                this.onChange(e, client);
                                            }
                                        })}
                                    />
                                )}
                            </ApolloConsumer>
                            {isOpen && (
                                <Paper className={paper}>
                                    {this.state.items.map((item, index) => (
                                        <MenuItem
                                            key={item.id}
                                            {...getItemProps({ item })}
                                            classes={{ selected }}
                                            selected={index === highlightedIndex}
                                        >
                                            <ListItemIcon>
                                                <Avatar alt={item.title} src={item.image} />
                                            </ListItemIcon>
                                            <ListItemText primary={item.title} />
                                        </MenuItem>
                                    ))}
                                    {!this.state.items.length && !this.state.loading && (
                                        <MenuItem>Nothing Found for {inputValue}</MenuItem>
                                    )}
                                </Paper>
                            )}
                        </div>
                    )}
                </Downshift>
            </div>
        );
    }
}

AutoComplete.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AutoComplete);
