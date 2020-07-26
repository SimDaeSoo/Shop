import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import { initialize } from '../utils';
import ItemCard from '../components/ItemCard';
import { Layout, Menu, Carousel } from 'antd';
import { HomeOutlined, StarOutlined, TagsOutlined, AppstoreOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';

const HeaderMenuStyle = { height: '32px', width: '112px', textAlign: 'center' };

@inject('environment', 'auth')
@observer
class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { environment, auth, i18n } = this.props;

        return (
            <Layout className="layout" style={{ maxWidth: '1280px', width: '100%', margin: 'auto' }}>
                <div style={{ height: '240px' }}>
                    <img src='https://cdn.searchenginejournal.com/wp-content/uploads/2018/04/e-commerce-store-1520x800.png' style={{ opacity: 0.2, width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
                <Layout.Header style={{ overflow: 'hidden', background: 'rgba(255,255,255,0.4)', padding: '0', height: '34px', lineHeight: '32px', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)'}}>
                    <Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']} style={{ height: '32px', backgroundColor: 'transparent' }}>
                        <Menu.Item key="1" style={HeaderMenuStyle}>
                            <HomeOutlined />{i18n.t('home')}
                        </Menu.Item>
                        <Menu.Item key="2" style={HeaderMenuStyle}>
                            <StarOutlined />{i18n.t('new')}
                        </Menu.Item>
                        <Menu.Item key="3" style={HeaderMenuStyle}>
                            <TagsOutlined />{i18n.t('sale')}
                        </Menu.Item>
                        <Menu.SubMenu key="category" icon={<AppstoreOutlined />} title={i18n.t('category')}>
                            <Menu.Item key="4">Option 5</Menu.Item>
                            <Menu.Item key="5">Option 6</Menu.Item>
                            <Menu.Item key="7">Option 7</Menu.Item>
                            <Menu.Item key="8">Option 8</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Layout.Header>
                <Layout.Content>
                    <div className="site-layout-content">
                        <Carousel autoplay dotPosition='left' style={{
                            textAlign: 'center',
                            height: '500px',
                            overflow: 'hidden',
                            borderRadius: '20px',
                            margin: '20px',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)'
                        }}>
                            <div>
                                <img src='https://cdn.wallpapersafari.com/82/13/nlpBKP.jpg' style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <img src='https://simracingsetup.com/wp-content/uploads/2020/02/F1-2020-All-Team-Desktop-Wallpaper.jpg' style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <img src='https://wallpaperaccess.com/full/890113.png' style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
                            </div>
                        </Carousel>
                    </div>
                    <div style={{ display: 'inline-block', textAlign: 'center' }}>
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
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