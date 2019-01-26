import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import { ApolloProvider } from 'react-apollo';
import getPageContext from '../lib/getPageContext';
import withData from '../lib/withData';
import Header from '../components/Header';

class MyApp extends App {
    static async getInitialProps({ Component, router, ctx }) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        pageProps.pathname = ctx.pathname;
        pageProps.query = ctx.query;
        return { pageProps };
    }

    constructor(props) {
        super(props);
        this.pageContext = getPageContext();
    }

    componentDidMount() {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        const { Component, pageProps, apollo } = this.props;

        return (
            <Container>
                <Head>
                    <title>Sick Fits!</title>
                </Head>
                {/* Wrap every page in Jss and Theme providers */}
                <JssProvider
                    registry={this.pageContext.sheetsRegistry}
                    generateClassName={this.pageContext.generateClassName}
                >
                    {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
                    <MuiThemeProvider theme={this.pageContext.theme} sheetsManager={this.pageContext.sheetsManager}>
                        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                        <CssBaseline />
                        {/* Pass pageContext to the _document through the renderPage enhancer
                to render collected styles on server side. */}
                        <ApolloProvider client={apollo}>
                            <Header pathname={pageProps.pathname} />
                            <Component pageContext={this.pageContext} {...pageProps} />
                        </ApolloProvider>
                    </MuiThemeProvider>
                </JssProvider>
            </Container>
        );
    }
}

export default withData(MyApp);
