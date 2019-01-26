import React, { Component } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import AddToCart from './AddToCart';
import DeleteItem from './DeleteItem';
import formatMoney from '../lib/formatMoney';

const styles = theme => ({
    card: {
        maxWidth: 345
    },
    media: {
        objectFit: 'cover',
        height: 250
    },
    price: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '0 5px'
    },
    color: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText
    },
    actions: {
        justifyContent: 'center'
    }
});

class Item extends Component {
    render() {
        const {
            classes: { card, media, price, color, actions },
            item
        } = this.props;

        return (
            <Grid item sm={3}>
                <Card className={card}>
                    <CardActionArea onClick={() => Router.push({ pathname: '/item', query: { id: item.id } })}>
                        <CardMedia component="img" className={media} title={item.title} image={item.image} />
                        <Typography className={`${price} ${color}`} variant="h6">
                            {formatMoney(item.price)}
                        </Typography>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2" className={color}>
                                {item.title}
                            </Typography>
                            <Typography component="p">{item.description}</Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions className={actions}>
                        <Button
                            size="small"
                            color="primary"
                            onClick={() => Router.push({ pathname: '/update', query: { id: item.id } })}
                        >
                            Edit
                        </Button>
                        <AddToCart id={item.id} />
                        <DeleteItem id={item.id}>Delete</DeleteItem>
                    </CardActions>
                </Card>
            </Grid>
        );
    }
}

Item.propTypes = {
    classes: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired
};

export default withStyles(styles)(Item);
