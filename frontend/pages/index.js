import React from 'react';
import Items from '../components/Items';

const Home = ({ query }) => {
    return <Items page={parseFloat(query.page) || 1} />;
};

export default Home;
