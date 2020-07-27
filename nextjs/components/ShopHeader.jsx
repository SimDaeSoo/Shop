import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import { Layout, Menu } from 'antd';
import { HomeOutlined, StarOutlined, TagsOutlined, AppstoreOutlined } from '@ant-design/icons';

const HeaderMenuStyle = { height: '32px', width: '112px', textAlign: 'center' };

@inject('environment', 'auth')
@observer
class ShopHeader extends React.Component {
    render() {
        const { i18n } = this.props;

        return (
            <Layout.Header style={{ overflow: 'hidden', background: 'rgba(255,255,255,0.4)', padding: '0', height: '34px', lineHeight: '32px', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)' }}>
                <Menu theme="light" mode="horizontal" selectedKeys={['1']} style={{ height: '32px', backgroundColor: 'transparent' }}>
                    <Menu.Item key="1" style={HeaderMenuStyle}>
                        <HomeOutlined />{i18n.t('home')}
                    </Menu.Item>
                    {/* <Menu.Item key="2" style={HeaderMenuStyle}>
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
                    </Menu.SubMenu> */}
                </Menu>
            </Layout.Header>
        );
    }
}

export default withTranslation('ShopHeader')(ShopHeader);
