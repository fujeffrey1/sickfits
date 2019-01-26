import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    root: {
        position: 'relative',
        paddingLeft: 10,
        '& .count': {
            position: 'relative',
            display: 'block',
            backfaceVisibility: 'hidden'
        },
        '& .count-enter': {
            transform: 'scale(4) rotateX(0.5turn)',
            transition: 'none'
        },
        '& .count-enter-active': {
            transform: 'rotateX(0)',
            transition: 'all 0.4s'
        },
        '& .count-exit': {
            transform: 'rotateX(0)',
            transition: 'all 0.4s',
            position: 'absolute',
            top: 0
        },
        '& .count-exit-active': {
            transform: 'scale(4) rotateX(0.5turn)',
            transition: 'all 0.4s'
        }
    },
    chip: {
        cursor: 'pointer',
        height: 18,
        fontWeight: 'bold'
    }
};

const CartCount = ({ classes: { root, chip }, count }) => (
    <TransitionGroup className={root}>
        <CSSTransition unmountOnExit classNames="count" className="count" key={count} timeout={400}>
            <Chip label={count} color="secondary" classes={{ root: chip }} />
        </CSSTransition>
    </TransitionGroup>
);

CartCount.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired
};

export default withStyles(styles)(CartCount);
