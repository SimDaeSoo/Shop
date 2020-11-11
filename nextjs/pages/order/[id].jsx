import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import { initialize } from '../../utils';
import { Button, Layout, Divider, message, Row, Col, Carousel, Tag } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import axios from 'axios';
import MainHeader from '../../components/MainHeader';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import i18n from '../../locales/i18n';
import Router from 'next/router';

@inject('environment', 'auth')
@observer
class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        if (process.browser) {
            this.initialize();
        }
        const { order } = this.props;
        this.state = { order };
    }

    initialize() {
        const IMP = window.IMP;
        IMP.init("imp99962599");
    }

    async chat() {
        const { auth, environment } = this.props;
        const { order } = this.state;
        try {
            await auth.createRoom(order);
            environment.toggleMainDrawer();
        } catch (e) {
            message.error('이미 진행중인 발주입니다.');
        }
    }

    async clearOrder() {
        const { order } = this.state;
        await axios.put(`http://www.everywear.site/api/orders/${order.id}`, { disabled: true });
        message.success('지원 마감되었습니다.');
        Router.push('/');
    }

    pay() {
        const { auth } = this.props;
        const { order } = this.state;
        disablePageScroll();
        window.scrollTo(0, 0);
        IMP.request_pay({
            pg: "kakao",
            pay_method: "card",
            merchant_uid: 'merchant_' + new Date().getTime(),
            name: `${order.title}개`,
            amount: order.amount,
            buyer_email: auth.user.email,
            buyer_name: auth.user.username,
            // buyer_tel: "010-3192-8053",
            // buyer_addr: "서울특별시 성북구 보문동",
            // buyer_postcode: "01181"
        }, async (rsp) => {
            if (rsp.success) {
                message.success('결제 성공했습니다');
                enablePageScroll();
            } else {
                message.error('결제 실패했습니다');
                enablePageScroll();
            }
        });
    }

    validateBusiness() {
        const { order } = this.state;
        window.open(`https://www.bizno.net/?query=${order.user.business_number}`);
    }

    componentDidMount() {
        const { order } = this.state;
        console.log();
        const container = document.getElementById('map');
        const location = new kakao.maps.LatLng(order.location[0], order.location[1]);
        const options = { center: location, level: 4 };
        const marker = new kakao.maps.Marker({ position: location });
        const map = new kakao.maps.Map(container, options);
        const mapTypeControl = new kakao.maps.MapTypeControl();
        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
        marker.setMap(map);
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

    async cancelOrder() {
        const { order } = this.props;
        const response = await axios.get(`/api/orders/${order.id}`);
        const _order = response.data;
        _order.ordering = false;
        await axios.put(`/api/orders/${_order.id}`, _order);
        message.success('발주 진행이 취소되었습니다.');
        setTimeout(() => Router.reload(), 1000);
    }

    render() {
        const { auth } = this.props;
        const { order } = this.state;

        return (
            <Layout className="layout" style={{ maxWidth: '1280px', width: '100%', margin: 'auto' }}>
                <MainHeader showSearch={false} />
                <Layout.Content>
                    <div className='contents' style={{ marginTop: '24px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '8px' }}>
                        <Row type='flex' justify='center' style={{ minHeight: '360px' }}>
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
                                <div style={{ textAlign: 'right' }}> <Tag>발주업체</Tag><Tag color='blue'>{order.user.username} ({order.user.email})</Tag> </div>
                                <Divider style={{ margin: '10px 0' }} />
                                <div style={{ display: 'flex', marginTop: '4px' }}><Tag style={{ height: '24px' }}>발주 수량</Tag>{order.ea}개</div>
                                <div style={{ display: 'flex', marginTop: '4px' }}><Tag style={{ height: '24px' }}>설명</Tag>{order.description}</div>
                                <div style={{ display: 'flex', marginTop: '4px' }}><Tag style={{ height: '24px' }}>기한</Tag>{order.deadline}</div>
                                <div style={{ display: 'flex', marginTop: '4px' }}><Tag style={{ height: '24px' }}>주소</Tag>{order.address}</div>
                                <div style={{ display: 'flex', marginTop: '4px' }}><Tag style={{ height: '24px' }}>번호</Tag>{order.phone}</div>

                                <div style={{ textAlign: 'right' }}>
                                    {
                                        !auth.hasPermission || (auth.hasPermission && auth.user.id !== order.user.id) &&
                                        <Button type='danger' onClick={() => this.validateBusiness()} style={{ width: '100px', marginRight: '10px' }} disabled={!auth.hasPermission}>
                                            <span style={{ marginLeft: '4px', fontSize: '0.8em' }}>사업자 확인</span>
                                        </Button>
                                    }
                                    {
                                        (!auth.hasPermission || (auth.hasPermission && auth.user.id !== order.user.id)) &&
                                        <Button type='primary' onClick={() => this.chat()} style={{ width: '100px', marginRight: '10px' }} disabled={!auth.hasPermission || order.ordering}>
                                            <GiftOutlined />
                                            <span style={{ marginLeft: '4px', fontSize: '0.8em' }}>지원하기</span>
                                        </Button>
                                    }
                                    {
                                        auth.hasPermission && auth.user.id === order.user.id &&
                                        <Button type='primary' onClick={() => this.cancelOrder()} style={{ width: '100px', marginRight: '10px' }} disabled={!auth.hasPermission || !order.ordering}>
                                            <span style={{ marginLeft: '4px', fontSize: '0.8em' }}>진행 취소</span>
                                        </Button>
                                    }
                                    {
                                        auth.hasPermission && auth.user.id === order.user.id &&
                                        <Button type='danger' onClick={() => this.clearOrder()} style={{ width: '100px', marginRight: '10px' }} disabled={!auth.hasPermission}>
                                            <span style={{ marginLeft: '4px', fontSize: '0.8em' }}>지원마감</span>
                                        </Button>
                                    }
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

                        <Divider style={{ margin: '10px 0' }} >위치정보</Divider>
                        <div style={{ width: '100%', margin: 'auto', maxWidth: '1024px', paddingLeft: '28px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', marginTop: '4px' }}><Tag style={{ height: '24px' }}>주소</Tag>{order.address}</div>
                        </div>
                        <div id='map' style={{ width: '100%', margin: 'auto', height: '500px', maxWidth: '968px', padding: '28px' }} />
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

    if (initializeData) {
        const { user } = initializeData.auth || undefined;
        if (user && user.id && !user.type) {
            context.res.writeHead(303, { Location: '/type' });
            context.res.end();
        }
    }

    return { props: { initializeData, order } };
}

export default withTranslation('OrderDetail')(OrderDetail);