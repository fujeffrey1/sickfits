import React from 'react';
import PleaseSignIn from '../components/PleaseSignIn';
import Order from '../components/Order';

const OrderPage = props => {
    return (
        <PleaseSignIn>
            <Order id={props.query.id} />
        </PleaseSignIn>
    );
};

export default OrderPage;
