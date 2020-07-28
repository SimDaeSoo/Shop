import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import { initialize } from '../utils';
import OrderCard from '../components/OrderCard';
import ShopHeader from '../components/ShopHeader';
import MainLogo from '../components/MainLogo';
import EventPanel from '../components/EventPanel';
import { Layout, message } from 'antd';
import axios from 'axios';


@inject('environment', 'auth')
@observer
class Home extends React.Component {
    constructor(props) {
        super(props);
        const { orders } = this.props;
        this.state = { orders };
    }

    async toggle(type, orderId) {
        const { auth } = this.props;
        if (!auth.jwt) return;

        try {
            const headers = { Authorization: `bearer ${auth.jwt}` };
            const response = await axios.post(`/api/toggle`, { type, order: orderId }, { headers });
            const { data } = response;
            const { user, order } = data;
            auth.user = user;

            const { orders } = this.state;
            for (const index in orders) {
                const _order = orders[index];
                if (Number(_order.id) === Number(order.id)) {
                    orders[index] = order;
                }
            }

            this.setState({ orders });
            message.success('요청에 성공했습니다');
        } catch (e) {
            message.error('요청에 실패했습니다');
        }
    }

    render() {
        const { orders } = this.state;
        return (
            <Layout className="layout" style={{ maxWidth: '1280px', width: '100%', margin: 'auto' }}>
                <MainLogo />
                <ShopHeader />
                <Layout.Content>
                    <EventPanel />
                    <div style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}>
                        {
                            orders && orders.map((order) => {
                                return <OrderCard order={order} key={order.id} toggle={this.toggle.bind(this)} />
                            })
                        }
                    </div>
                </Layout.Content>
                <Layout.Footer style={{ textAlign: 'center', padding: '10 0px' }}>EveryWear ©2020 Created by SCH</Layout.Footer>
            </Layout >
        );
    }
}

async function getOrders() {
    const query = `
        query {
            orders {
                id
                title
                description
                amount
                before_amount
                user {
                    id
                    username
                }
                stock
                thumbnail_images {
                    id
                    name
                    url
                }
                liked_users {
                    id
                }
                carried_users {
                    id
                }
            }
        }
    `;

    const response = await axios.post(`${process.env.SSR_API_URL}/graphql`, { query });
    const { data } = response.data || {};
    const { orders } = data || [];
    return orders;
}

export async function getServerSideProps(context) {
    const initializeData = await initialize(context);
    const orders = await getOrders();
    return { props: { initializeData, orders } };
}

export default withTranslation('Home')(Home);