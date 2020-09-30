import React from 'react';
import App from 'next/app';

/* MobX */
import { Provider } from 'mobx-react';
import initializeStore from '../stores';

/* I18N */
import { I18nextProvider } from 'react-i18next';
import i18n from '../locales/i18n';

/* Styles */
import 'nprogress/nprogress.css';
import '../public/styles/init.css';
import 'antd/dist/antd.css';
import { Drawer } from 'antd';

/* Components */
import Head from '../components/Head';

/* N-Progress */
import dynamic from 'next/dynamic';
const TopProgressBar = dynamic(() => import('../components/TopProgressBar'), { ssr: false });

class _App extends App {
    constructor(props) {
        super(props);
        const { initializeData } = this.props.pageProps;
        this.store = initializeStore(initializeData);
    }

    componentDidMount() {
        const { initializeData } = this.props.pageProps;
        const { user } = initializeData.auth || {};
        console.log(this.store, user);
    }

    render() {
        const { Component, pageProps } = this.props;

        return (
            <>
                <TopProgressBar />
                <I18nextProvider i18n={i18n}>
                    <Provider {...this.store}>
                        <Head title='Every Factory' />
                        <Component {...pageProps} />
                    </Provider>
                </I18nextProvider>
            </>
        );
    }
}

export default _App;