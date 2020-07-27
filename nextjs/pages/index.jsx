import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import { initialize } from '../utils';
import OrderCard from '../components/OrderCard';
import ShopHeader from '../components/ShopHeader';
import MainLogo from '../components/MainLogo';
import EventPanel from '../components/EventPanel';
import { Layout } from 'antd';


@inject('environment', 'auth')
@observer
class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout className="layout" style={{ maxWidth: '1280px', width: '100%', margin: 'auto' }}>
                <MainLogo />
                <ShopHeader />
                <Layout.Content>
                    <EventPanel />
                    <div style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}>
                        <OrderCard />
                    </div>
                </Layout.Content>
                <Layout.Footer style={{ textAlign: 'center', padding: '10 0px' }}>EveryWear ©2020 Created by SCH</Layout.Footer>
            </Layout >
        );
    }
}

export async function getServerSideProps(context) {
    const initializeData = await initialize(context);
    return { props: { initializeData } };
}

export default withTranslation('Home')(Home);