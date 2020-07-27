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
        const { orders } = this.props;
        return (
            <Layout className="layout" style={{ maxWidth: '1280px', width: '100%', margin: 'auto' }}>
                <MainLogo />
                <ShopHeader />
                <Layout.Content>
                    <EventPanel />
                    <div style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}>
                        {
                            orders && orders.map((order) => {
                                return <OrderCard order={order} key={order.id} />
                            })
                        }
                    </div>
                </Layout.Content>
                <Layout.Footer style={{ textAlign: 'center', padding: '10 0px' }}>EveryWear ©2020 Created by SCH</Layout.Footer>
            </Layout >
        );
    }
}

export async function getServerSideProps(context) {
    const initializeData = await initialize(context);
    const testData = {
        id: 1,
        title: 'test title',
        description: 'test description',
        amount: 35000,
        before_amount: 35000,
        stock: 200,
        liked_users: [{ id: 1 }],
        carried_users: []
    };
    return { props: { initializeData, orders: [testData] } };
}

export default withTranslation('Home')(Home);