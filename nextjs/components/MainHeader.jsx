import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import Router from 'next/router';
import { Input, Button, Tag, Avatar, Badge, Select, message } from 'antd';
import { GoogleOutlined, LogoutOutlined, UserOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';

@inject('environment', 'auth')
@observer
class MainHeader extends React.Component {
    changeLanguage(language) {
        const { environment } = this.props;
        environment.set('language', language);
    }

    goHome(e) {
        e.stopPropagation();
        const { environment } = this.props;
        Router.push(`/${environment.queryString}`)
    }

    login(e) {
        e.stopPropagation();
        Router.push('/connect/google');
    }

    logout(e) {
        e.stopPropagation();
        const { auth } = this.props;
        auth.logout();
        message.info('로그아웃 완료');
    }

    render() {
        const { environment, auth, i18n, showSearch } = this.props;
        return (
            <div style={{ height: '280px', position: 'relative' }}>
                <img src='/uploads/3_0_RGB_7e3e62cf0d.png' style={{ opacity: 0.2, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />

                <div style={{ position: 'absolute', color: 'white', top: '58px', width: '100%', zIndex: 2, fontSize: '5em', textAlign: 'center', textShadow: '2px 2px 2px gray' }} onClick={this.goHome.bind(this)}>
                    <div>{i18n.t('everywear')}</div>
                    <div style={{ fontSize: '0.3em' }}>{i18n.t('site_description')}</div>
                </div>

                {
                    showSearch &&
                    <div style={{ position: 'absolute', bottom: '24px', width: '50%', marginLeft: '25%', zIndex: 2 }}>
                        <Input.Search placeholder={i18n.t('search_description')} onSearch={value => console.log(value)} enterButton />
                    </div>
                }

                <div style={{ position: 'absolute', top: 0, height: '48px', padding: '4px', width: '100%', textAlign: 'right' }}>
                    <div style={{ display: 'inline-block', marginTop: '4px' }}>
                        {
                            auth.hasPermission &&
                            <>
                                <Badge dot status="success">
                                    <Avatar icon={<UserOutlined />} />
                                </Badge>
                                <Tag color='blue' style={{ marginLeft: '4px', marginRight: '8px' }}>{auth.user.email}</Tag>
                            </>
                        }
                        {
                            !auth.hasPermission &&
                            <Button icon={<GoogleOutlined />} type='primary' onClick={this.login.bind(this)} style={{ marginRight: '4px' }}>
                                Google {i18n.t('login')}
                            </Button>
                        }
                        {
                            auth.hasPermission &&
                            <>
                                <div style={{ display: 'inline-block', marginRight: '4px' }}>
                                    <Badge count={auth.carried.length} style={{ zIndex: 2 }} >
                                        <Button icon={<ShoppingCartOutlined />} type='primary'>
                                        </Button>
                                    </Badge>
                                </div>
                                <div style={{ display: 'inline-block', marginRight: '4px' }}>
                                    <Badge count={auth.liked.length} style={{ zIndex: 2 }} >
                                        <Button icon={<HeartOutlined />} type='primary'>
                                        </Button>
                                    </Badge>
                                </div>
                                <Button icon={<LogoutOutlined />} type='danger' onClick={this.logout.bind(this)} style={{ marginRight: '4px' }}>
                                </Button>
                            </>
                        }

                        <div style={{ display: 'inline-block', marginRight: '4px' }}>
                            <Select value={environment.language} onChange={this.changeLanguage.bind(this)} showArrow={false}>
                                <Select.Option value="ko">KO</Select.Option>
                                <Select.Option value="en">EN</Select.Option>
                            </Select>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default withTranslation('MainHeader')(MainHeader);