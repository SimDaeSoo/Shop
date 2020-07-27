import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import Router from 'next/router';
import { Carousel, Card, Tag } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';

const CardStyle = { borderRadius: '4px', width: 300, margin: '10px', display: 'inline-block', verticalAlign: 'top', textAlign: 'left', border: 'none', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)' };

@inject('environment', 'auth')
@observer
class OrderCard extends React.Component {
    detail(e) {
        e.prevent
        Router.push(`/order/${1}`);
    }

    toggleLike(e) {
        e.stopPropagation();
    }

    addCart(e) {
        e.stopPropagation();
    }

    render() {
        const { environment, auth, i18n, order } = this.props;

        return (
            <Card
                hoverable
                style={CardStyle}
                cover={
                    <Carousel autoplay style={{
                        textAlign: 'center',
                        height: '300px',
                        overflow: 'hidden',
                    }}>
                        <div>
                            {/* <img src="https://cdn.crewbi.com/images/goods_img/20190812/347455/347455_a_500.jpg" style={{ width: '100%', height: '300px', objectFit: 'cover' }} /> */}
                        </div>
                        <div>
                            {/* <img src="https://usercontents-c.styleshare.io/images/20428940/700x432" style={{ width: '100%', height: '300px', objectFit: 'cover' }} /> */}
                        </div>
                        <div>
                            {/* <img src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" style={{ width: '100%', height: '300px', objectFit: 'cover' }} /> */}
                        </div>
                    </Carousel>
                }
                actions={[
                    <ShoppingCartOutlined key='addCart' onClick={this.addCart.bind(this)} />,
                    <>
                        {
                            true &&
                            <HeartOutlined key='like' onClick={this.toggleLike.bind(this)} />
                        }
                        {
                            false &&
                            <HeartFilled />
                        }
                    </>
                ]}
                onClick={this.detail.bind(this)}
            >
                <Tag color='magenta' style={{ position: 'absolute', top: '4px', left: '4px' }}>40% Sale</Tag>
                <Tag style={{ position: 'absolute', top: '4px', right: '4px', margin: 0 }}>daesoo94</Tag>
                <Card.Meta
                    title={order.title}
                    description={
                        <div>
                            <div style={{ textAlign: 'right' }}>
                                <Tag style={{ textDecoration: 'line-through' }}>{order.before_amount} ₩</Tag>
                                <Tag color='red' style={{ marginRight: 0 }}>{order.amount} ₩</Tag>
                            </div>
                            <div style={{ marginTop: '4px', fontSize: '0.8em' }}>
                                {order.description}
                            </div>
                        </div>
                    }
                />
            </Card>
        );
    }
}

export default withTranslation('OrderCard')(OrderCard);