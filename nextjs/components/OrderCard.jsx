import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import Router from 'next/router';
import { Carousel, Card, Tag } from 'antd';
import LazyLoad from 'react-lazyload';

const CardStyle = { borderRadius: '4px', width: 300, margin: '10px', display: 'inline-block', verticalAlign: 'top', textAlign: 'left', border: 'none', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)' };

@inject('environment', 'auth')
@observer
class OrderCard extends React.Component {
    detail(e) {
        const { environment, order } = this.props;
        e.stopPropagation();
        Router.push(`/order/${order.id}${environment.queryString}`);
    }

    render() {
        const { order } = this.props;

        return (
            <Card
                hoverable
                style={CardStyle}
                cover={
                    <div style={{ height: '300px' }}>
                        <Carousel autoplay style={{
                            textAlign: 'center',
                            height: '300px',
                            overflow: 'hidden',
                        }}>
                            {
                                order.thumbnail_images.map((image) => {
                                    return (
                                        <LazyLoad height={300} key={image.id}>
                                            <img src={image.url} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                                        </LazyLoad>
                                    )
                                })
                            }
                        </Carousel>
                    </ div>
                }
                onClick={this.detail.bind(this)}
            >
                <Tag color='orange' style={{ position: 'absolute', top: '4px', right: '4px', margin: 0 }}>#{order.user.username}</Tag>
                <Card.Meta
                    title={`${order.title} | ${order.ea}개 | ${order.deadline}`}
                    description={
                        <div>
                            <div style={{ marginTop: '4px', fontSize: '0.8em' }}>
                                {order.description.length >= 120 ? `${order.description.slice(0, 120)}...` : order.description}
                            </div>
                            <div style={{ marginTop: '4px', fontSize: '0.8em' }}>
                                {order.address}
                            </div>
                        </div>
                    }
                />
            </Card>
        );
    }
}

export default withTranslation('OrderCard')(OrderCard);