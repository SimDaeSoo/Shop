import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import Router from 'next/router';
import { Input, Button, Tag, Avatar, Badge } from 'antd';
import { GoogleOutlined, LogoutOutlined, UserOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';

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
            <div style={{ height: '280px', position: 'relative' }}>
                <img src='https://lh3.googleusercontent.com/proxy/d0swTDXh6AZjstM-a6wdjPeOo6cqK7ML4g4-tRDkv_-EaeyMQjmeIOHX4AouAvSn7n55DFEQhfmTWH1Sk_5WVHZB3wZ6Ljgj0Tmq8HGzFTP6r5Vi_USdrp6kpHZSEAtGZw99Z0hh8sQ' style={{ opacity: 0.2, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ position: 'absolute', color: 'white', top: '62px', width: '100%', zIndex: 2, fontSize: '5em', textAlign: 'center', textShadow: '2px 2px 2px gray' }}>
                    <div>Every Wear</div>
                    <div style={{ fontSize: '0.3em' }}>{i18n.t('site_description')}</div>
                </div>

                <div style={{ position: 'absolute', bottom: '24px', width: '50%', marginLeft: '25%', zIndex: 2 }}>
                    <Input.Search onSearch={value => console.log(value)} enterButton />
                </div>

                <div style={{ position: 'absolute', top: 0, height: '48px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '4px', width: '100%', textAlign: 'right', borderRadius: '8px' }}>
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
                    </div>
                    {/* <div style={{ display: 'inline-block', marginRight: '8px' }}>
                        <Select value={environment.language} onChange={this.changeLanguage.bind(this)}>
                            <Select.Option value="ko">{i18n.t('korean')}</Select.Option>
                            <Select.Option value="en">{i18n.t('english')}</Select.Option>
                        </Select>
                    </div> */}
                </div>
            </div >
        );
    }
}

export default withTranslation('MainLogo')(MainLogo);