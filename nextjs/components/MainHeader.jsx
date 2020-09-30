import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import Router from 'next/router';
import { Input, Button, Tag, Avatar, Badge, message, Drawer } from 'antd';
import { GoogleOutlined, LogoutOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';

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
            <div style={{ height: '220px', position: 'relative', marginTop: '8px', marginLeft: '4px', marginRight: '4px' }}>
                <img src='/assets/logo.jpg' style={{ opacity: 0.6, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />

                <div style={{ position: 'absolute', color: 'white', top: '48px', width: '100%', zIndex: 2, fontSize: '4em', textAlign: 'center', textShadow: '2px 2px 2px gray' }} onClick={this.goHome.bind(this)}>
                    <div>{'에브리팩토리'}</div>
                    <div style={{ fontSize: '0.35em' }}>필요한 발주를 등록하고 원하는 발주를 찾아보세요!</div>
                </div>

                {
                    showSearch &&
                    <div style={{ position: 'absolute', width: '100%', textAlign: 'center', bottom: '12px', zIndex: 2 }}>
                        <Input.Search style={{ width: '80%', maxWidth: '800px' }} placeholder={'찾고자 하는 발주를 입력해 주세요.'} onSearch={value => console.log(value)} enterButton />
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
                                <Tag color='magenta' style={{ marginLeft: '4px', marginRight: 0 }}>{auth.user.type === 'upper' ? '발주업체' : '하청업체'}</Tag>
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
                            <Button icon={<LogoutOutlined />} type='danger' onClick={this.logout.bind(this)} style={{ marginRight: '4px' }}>
                            </Button>
                        }
                        {
                            auth.hasPermission &&
                            <Badge count={0}>
                                <Button icon={<MessageOutlined />} type='primary' onClick={() => { environment.toggleMainDrawer(); }} style={{ marginRight: '4px' }}>
                                </Button>
                            </Badge>
                        }
                    </div>
                </div>
                <Drawer
                    title="다이렉트 메세지"
                    width='360px'
                    onClose={() => { environment.toggleMainDrawer(); }}
                    visible={environment.mainDrawer}
                >
                    <Button onClick={() => { environment.toggleSubDrawer(); }}>Click Me</Button>
                    <Drawer
                        title="TESA 다독이"
                        width='360px'
                        onClose={() => { environment.toggleSubDrawer(); }}
                        visible={environment.subDrawer}
                    >
                        TESA 다독이에 대해서 떠드는 채팅방
                    </Drawer>
                </Drawer>
            </div >
        );
    }
}

export default withTranslation('MainHeader')(MainHeader);