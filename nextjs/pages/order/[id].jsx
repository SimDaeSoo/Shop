import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import { initialize, commaFormat } from '../../utils';
import { Button, Layout, Divider, message, Row, Col, Carousel, Radio, InputNumber, Tag } from 'antd';
import { ShoppingOutlined, ShoppingFilled, HeartOutlined, HeartFilled, GiftOutlined } from '@ant-design/icons';
import axios from 'axios';
import MainHeader from '../../components/MainHeader';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import i18n from '../../locales/i18n';

@inject('environment', 'auth')
@observer
class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        if (process.browser) {
            this.initialize();
        }
        const { order } = this.props;
        this.state = { order, quantity: 1 };
    }

    initialize() {
        const IMP = window.IMP;
        IMP.init("imp99962599");
    }

    pay() {
        const { auth } = this.props;
        const { order, quantity } = this.state;
        disablePageScroll();
        window.scrollTo(0, 0);
        IMP.request_pay({
            pg: "kakao",
            pay_method: "card",
            merchant_uid: 'merchant_' + new Date().getTime(),
            name: `${order.title} ${commaFormat(quantity)}개`,
            amount: order.amount * quantity,
            buyer_email: auth.user.email,
            buyer_name: auth.user.username,
            // buyer_tel: "010-3192-8053",
            // buyer_addr: "서울특별시 성북구 보문동",
            // buyer_postcode: "01181"
        }, async (rsp) => {
            if (rsp.success) {
                const headers = { Authorization: `bearer ${auth.jwt}` };
                const buyResponse = await axios.post(`/api/orders/${order.id}/buy`, { quantity }, { headers });
                const responseOrder = buyResponse.data;
                this.setState({ order: responseOrder });

                message.success('결제 성공했습니다');
                enablePageScroll();
            } else {
                message.error('결제 실패했습니다');
                enablePageScroll();
            }
        });
    }

    async toggle(type) {
        const { auth, order } = this.props;
        if (!auth.jwt) return;

        try {
            const headers = { Authorization: `bearer ${auth.jwt}` };
            const response = await axios.post(`/api/toggle`, { type, order: order.id }, { headers });
            const { data } = response;
            this.setState({ order: data.order });
            message.success('요청에 성공했습니다');
        } catch (e) {
            message.error('요청에 실패했습니다');
        }
    }

    async refreshOrder() {
        const { order } = this.props;
        const response = await axios.get(`/api/orders/${order.id}`);
        this.setState({ order: response.data });
    }

    get isLiked() {
        const { auth } = this.props;
        const { order } = this.state;
        const ids = order.liked_users.map(user => Number(user.id));
        return ids.indexOf(auth.user.id || -1) >= 0;
    }

    get isCarried() {
        const { auth } = this.props;
        const { order } = this.state;
        const ids = order.carried_users.map(user => Number(user.id));
        return ids.indexOf(auth.user.id || -1) >= 0;
    }

    changeQuantity(quantity) {
        this.setState({ quantity });
    }

    render() {
        const { auth } = this.props;
        const { order, quantity } = this.state;

        return (
            <Layout className="layout" style={{ maxWidth: '1280px', width: '100%', margin: 'auto' }}>
                <MainHeader showSearch={false} />
                <Layout.Content>
                    <div className='contents' style={{ marginTop: '24px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '8px' }}>
                        <Row type='flex' justify='center'>
                            <Col span={24} lg={12} style={{ textAlign: 'center' }}>
                                <div style={{ height: '100%', display: 'flex' }}>
                                    <div style={{ width: '320px', height: '320px', margin: 'auto', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)' }}>
                                        <Carousel autoplay>
                                            {order.thumbnail_images.map(image => <div key={image.id} style={{ width: '320px', height: '320px' }}><img src={image.url} style={{ borderRadius: '20px', width: '320px', height: '320px', objectFit: 'cover' }} /></div>)}
                                        </Carousel>
                                    </div>
                                </div>
                            </Col>

                            <Col span={24} lg={12} style={{ padding: '10px' }}>
                                <Divider style={{ margin: '10px 0' }} />
                                <div style={{ fontSize: '2em' }}>{order.title}</div>
                                <div style={{ textAlign: 'right' }}> <Tag>판매자</Tag><Tag color='blue'>{order.user.username} ({order.user.email})</Tag> </div>
                                <Divider style={{ margin: '10px 0' }} />
                                <div style={{ marginBottom: '18px' }}>{order.description}</div>
                                <div style={{ display: 'flex', marginTop: '4px' }}>
                                    <Tag style={{ height: '24px' }}>물품금액</Tag>
                                    <Tag color='geekblue' style={{ textDecoration: 'line-through', marginRight: '4px' }}>{commaFormat(order.before_amount)} ₩</Tag>
                                    <Tag color='red' style={{ marginRight: '4px' }}>{commaFormat(order.amount)} ₩</Tag>
                                </div>
                                <div style={{ display: 'flex', marginTop: '4px' }}><Tag style={{ height: '24px' }}>재고수량</Tag>{commaFormat(order.stock)}개</div>
                                <div style={{ display: 'flex', marginTop: '4px' }}><Tag style={{ height: '24px' }}>구매수량</Tag><InputNumber size='small' value={quantity} min={1} max={order.stock} onChange={this.changeQuantity.bind(this)} disabled={order.stock <= 0} /></div>
                                <div style={{ display: 'flex', marginTop: '4px' }}><Tag style={{ height: '24px' }}>결제수단</Tag><Radio disabled={true} defaultChecked>Kakao Pay</Radio></div>
                                <div style={{ display: 'flex', marginTop: '4px', marginBottom: '4px' }}><Tag style={{ height: '24px' }}>결제금액</Tag>{commaFormat(order.amount * quantity)} ₩</div>

                                <div style={{ textAlign: 'right' }}>
                                    <Button onClick={() => { this.toggle('carry') }} style={{ width: '100px', marginRight: '10px' }}>
                                        {!this.isCarried && <ShoppingOutlined />}
                                        {this.isCarried && <ShoppingFilled style={{ color: '#03A9F4' }} />}
                                        <span style={{ marginLeft: '4px', fontSize: '0.8em', color: this.isCarried ? '#03A9F4' : '' }}>{order.carried_users.length} {i18n.t('carry')}</span>
                                    </Button>
                                    <Button onClick={() => { this.toggle('like') }} style={{ width: '100px', marginRight: '10px' }}>
                                        {!this.isLiked && <HeartOutlined />}
                                        {this.isLiked && <HeartFilled style={{ color: '#EC407A' }} />}
                                        <span style={{ marginLeft: '4px', fontSize: '0.8em', color: this.isLiked ? '#EC407A' : '' }}>{order.liked_users.length} {i18n.t('like')}</span>
                                    </Button>
                                    <Button type='primary' onClick={this.pay.bind(this)} style={{ width: '100px', marginRight: '10px' }} disabled={!auth.hasPermission}>
                                        <GiftOutlined />
                                        <span style={{ marginLeft: '4px', fontSize: '0.8em' }}>구매</span>
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        <Divider>{i18n.t('detail')} {i18n.t('info')}</Divider>
                        <div style={{ width: '100%', margin: 'auto', maxWidth: '1024px', padding: '28px' }}>
                            {
                                order.detail_images.map((image, index) => {
                                    return <img src={image.url} key={index} style={{ width: '100%', height: 'auto' }} />
                                })
                            }
                        </div>
                    </div>
                </Layout.Content>
                <Layout.Footer style={{ textAlign: 'center', padding: '10 0px' }}>EveryWear ©2020 Created by SCH</Layout.Footer>
            </Layout >
        );
    }
}

async function getOrder(id) {
    const response = await axios.get(`${process.env.SSR_API_URL}/orders/${id}`);
    return response.data || {};
}

export async function getServerSideProps(context) {
    const initializeData = await initialize(context);
    const order = await getOrder(context.query.id);
    return { props: { initializeData, order } };
}

export default withTranslation('OrderDetail')(OrderDetail);