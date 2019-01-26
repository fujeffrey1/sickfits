import React from 'react';
import Reset from '../components/Reset';

const ResetPage = ({ query }) => {
    return <Reset resetToken={query.resetToken} />;
};

export default ResetPage;
