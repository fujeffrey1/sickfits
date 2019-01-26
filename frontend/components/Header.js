import { ToastContainer } from 'react-toastify';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'react-toastify/dist/ReactToastify.min.css';

import Nav from './Nav';
import Cart from './Cart';
import Search from './Search';

Router.events.on('routeChangeStart', () => {
    NProgress.start();
});

Router.events.on('routeChangeComplete', () => {
    NProgress.done();
});

Router.events.on('routeChangeError', () => {
    NProgress.done();
});

const Header = ({ pathname }) => {
    return (
        <div>
            <Nav pathname={pathname} />
            <Search />
            <Cart />
            <ToastContainer />
        </div>
    );
};

export default Header;
