import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import { initialize } from '../utils';
import OrderCard from '../components/OrderCard';
import MainHeader from '../components/MainHeader';
import EventPanel from '../components/EventPanel';
import { Layout, message } from 'antd';
import axios from 'axios';


@inject('environment', 'auth')
@observer
class Home extends React.Component {
    constructor(props) {
        super(props);
        const { orders, events } = this.props;
        this.state = { orders, events };
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
        const { orders, events } = this.state;
        return (
            <Layout className="layout" style={{ maxWidth: '1280px', width: '100%', margin: 'auto' }}>
                <MainHeader showSearch={true} />
                <Layout.Content>
                    <EventPanel events={events} />
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

async function getData() {
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
            events {
                id
                title
                description
                thumbnail
                begin
                end
            }
        }
    `;

    const response = await axios.post(`${process.env.SSR_API_URL}/graphql`, { query });
    const { data } = response.data || {};
    const { orders, events } = data;
    return { orders: orders || [], events: events || [] };
}

export async function getServerSideProps(context) {
    const initializeData = await initialize(context);
    const { orders, events } = await getData();
    return { props: { initializeData, orders, events } };
}

export default withTranslation('Home')(Home);