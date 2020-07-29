import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import Router from 'next/router';
import { Carousel, Card, Tag } from 'antd';
import { ShoppingOutlined, ShoppingFilled, HeartOutlined, HeartFilled, DropboxOutlined } from '@ant-design/icons';
import LazyLoad from 'react-lazyload';
import { commaFormat } from '../utils';

const CardStyle = { borderRadius: '4px', width: 300, margin: '10px', display: 'inline-block', verticalAlign: 'top', textAlign: 'left', border: 'none', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)' };

@inject('environment', 'auth')
@observer
class OrderCard extends React.Component {
    detail(e) {
        const { environment, order } = this.props;
        e.stopPropagation();
        Router.push(`/order/${order.id}${environment.queryString}`);
    }

    toggleLike(e) {
        const { toggle, order } = this.props;
        e.stopPropagation();
        if (toggle) toggle('like', order.id);
    }

    toggleCarry(e) {
        const { toggle, order } = this.props;
        e.stopPropagation();
        if (toggle) toggle('carry', order.id);
    }

    get isLiked() {
        const { order, auth } = this.props;
        const ids = order.liked_users.map(user => Number(user.id));
        return ids.indexOf(auth.user.id || -1) >= 0;
    }

    get isCarried() {
        const { order, auth } = this.props;
        const ids = order.carried_users.map(user => Number(user.id));
        return ids.indexOf(auth.user.id || -1) >= 0;
    }

    render() {
        const { i18n, order } = this.props;

        return (
            <Card
                hoverable
                style={CardStyle}
                cover={
                    <div style={{ height: '300px' }}>
                        <LazyLoad height={300}>
                            <Carousel autoplay style={{
                                textAlign: 'center',
                                height: '300px',
                                overflow: 'hidden',
                            }}>
                                {
                                    order.thumbnail_images.map((image) => {
                                        return (
                                            <img key={image.id} src={image.url} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                                        )
                                    })
                                }
                            </Carousel>
                        </LazyLoad>
                    </ div>
                }
                actions={[
                    <div onClick={(e) => e.stopPropagation()} key='stock'>
                        <DropboxOutlined style={{ color: '#17A589' }} />
                        <span style={{ marginLeft: '4px', fontSize: '0.8em', color: '#17A589' }}>{order.stock} {i18n.t('stock')}</span>
                    </ div>,
                    <div onClick={this.toggleCarry.bind(this)} key='addCart'>
                        {!this.isCarried && <ShoppingOutlined />}
                        {this.isCarried && <ShoppingFilled style={{ color: '#03A9F4' }} />}
                        <span style={{ marginLeft: '4px', fontSize: '0.8em', color: this.isCarried ? '#03A9F4' : '' }}>{order.carried_users.length} {i18n.t('carry')}</span>
                    </div>,
                    <div onClick={this.toggleLike.bind(this)} key='like'>
                        {!this.isLiked && <HeartOutlined />}
                        {this.isLiked && <HeartFilled style={{ color: '#EC407A' }} />}
                        <span style={{ marginLeft: '4px', fontSize: '0.8em', color: this.isLiked ? '#EC407A' : '' }}>{order.liked_users.length} {i18n.t('like')}</span>
                    </div>
                ]}
                onClick={this.detail.bind(this)}
            >
                {
                    order.before_amount !== order.amount &&
                    <Tag color='magenta' style={{ position: 'absolute', top: '4px', left: '4px' }}>{Math.round((order.before_amount - order.amount) / order.before_amount * 100)}% Sale</Tag>
                }
                <Tag color='orange' style={{ position: 'absolute', top: '4px', right: '4px', margin: 0 }}>#{order.user.username}</Tag>
                <Card.Meta
                    title={order.title}
                    description={
                        <div>
                            {
                                order.before_amount !== order.amount &&
                                <div style={{ position: 'absolute', top: '250px', left: 0, width: '100%', display: 'block', textAlign: 'right', height: '46px' }}>
                                    <Tag style={{ textDecoration: 'line-through', marginRight: '4px' }}>{commaFormat(order.before_amount)} ₩</Tag>
                                </div>
                            }
                            <div style={{ position: 'absolute', top: '273px', left: 0, width: '100%', display: 'block', textAlign: 'right', height: '46px' }}>
                                <Tag color='red' style={{ marginRight: '4px' }}>{commaFormat(order.amount)} ₩</Tag>
                            </div>
                            <div style={{ marginTop: '4px', fontSize: '0.8em', minHeight: '68px' }}>
                                {order.description.length >= 120 ? `${order.description.slice(0, 120)}...` : order.description}
                            </div>
                        </div>
                    }
                />
            </Card>
        );
    }
}

export default withTranslation('OrderCard')(OrderCard);