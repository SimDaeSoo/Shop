import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import Router from 'next/router';
import { Input, Select, Button, Tag, Avatar, Badge } from 'antd';
import { LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';

@inject('environment', 'auth')
@observer
class MainLogo extends React.Component {
    changeLanguage(language) {
        const { environment } = this.props;
        environment.set('language', language);
    }

    login() {
        Router.push('/connect/google');
    }

    logout() {
        const { auth } = this.props;
        auth.logout();
    }

    render() {
        const { environment, auth, i18n } = this.props;
        return (
            <div style={{ height: '240px', position: 'relative' }}>
                <img src='https://cdn.searchenginejournal.com/wp-content/uploads/2018/04/e-commerce-store-1520x800.png' style={{ opacity: 0.2, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', color: 'white', top: '32px', width: '100%', zIndex: 2, fontSize: '5em', textAlign: 'center', textShadow: '2px 2px 2px gray' }}>
                    <div>Every Wear</div>
                    <div style={{ fontSize: '0.3em' }}>{i18n.t('site_description')}</div>
                </div>

                <div style={{ position: 'absolute', bottom: '24px', width: '50%', marginLeft: '25%', zIndex: 2 }}>
                    <Input.Search onSearch={value => console.log(value)} enterButton />
                </div>

                <div style={{ position: 'absolute', top: 0, padding: '4px', width: '100%', textAlign: 'right' }}>
                    <div style={{ display: 'inline-block', marginRight: '4px' }}>
                        {
                            auth.hasPermission &&
                            <>
                                <Badge dot status="success">
                                    <Avatar icon={<UserOutlined />} />
                                </Badge>
                                <Tag style={{ marginLeft: '4px', marginRight: 0 }}>{auth.user.email}</Tag>
                            </>
                        }
                    </div>
                    <div style={{ display: 'inline-block', marginRight: '4px' }}>
                        {
                            !auth.hasPermission &&
                            <Button icon={<LoginOutlined />} type='primary' onClick={this.login.bind(this)}>
                                {i18n.t('login')}
                            </Button>
                        }
                        {
                            auth.hasPermission &&
                            <Button icon={<LogoutOutlined />} type='danger' onClick={this.logout.bind(this)}>
                                {i18n.t('logout')}
                            </Button>
                        }
                    </div>
                    <div style={{ display: 'inline-block' }}>
                        <Select value={environment.language} onChange={this.changeLanguage.bind(this)}>
                            <Select.Option value="ko">{i18n.t('korean')}</Select.Option>
                            <Select.Option value="en">{i18n.t('english')}</Select.Option>
                        </Select>
                    </div>
                </div>
            </div >
        );
    }
}

export default withTranslation('MainLogo')(MainLogo);