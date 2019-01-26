import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    div: {
        padding: '0 2rem',
        background: 'white',
        margin: '2rem 0',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderLeft: '5px solid red'
    }
};

const Error = ({ error, classes: { div } }) => {
    if (!error || !error.message) return null;
    if (error.networkError && error.networkError.result && error.networkError.result.errors.length) {
        return error.networkError.result.errors.map((error, i) => (
            <div key={i} className={div}>
                <p data-test="graphql-error">
                    <strong style={{ marginRight: '1rem' }}>Shoot!</strong>
                    {error.message.replace('GraphQL error: ', '')}
                </p>
            </div>
        ));
    }
    return (
        <div className={div}>
            <p data-test="graphql-error">
                <strong style={{ marginRight: '1rem' }}>Shoot!</strong>
                {error.message.replace('GraphQL error: ', '')}
            </p>
        </div>
    );
};

Error.defaultProps = {
    error: {}
};

Error.propTypes = {
    classes: PropTypes.object.isRequired,
    error: PropTypes.object
};

export default withStyles(styles)(Error);
