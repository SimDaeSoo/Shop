import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import Router from 'next/router';
import { Input, Button, Tag, Avatar, Badge, message, Drawer, Comment } from 'antd';
import { GoogleOutlined, LogoutOutlined, UserOutlined, MessageOutlined, MailOutlined } from '@ant-design/icons';
import moment from 'moment';
moment.locale('ko');

@inject('environment', 'auth')
@observer
class MainHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { roomIndex: undefined, message: '' };
    }

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

    emailLogin(e) {
        e.stopPropagation();
        Router.push('/login');
    }

    logout(e) {
        e.stopPropagation();
        const { auth } = this.props;
        auth.logout();
        message.info('로그아웃 완료');
    }

    async sendMessage(value) {
        const { roomIndex } = this.state;
        const { auth } = this.props;
        const messageRoom = auth.messageRooms[roomIndex];

        await auth.sendMessage(value, auth.user.id, messageRoom.id);

        this.setState({ message: '' });
    }

    changeMessage(e) {
        const message = e.target.value;
        this.setState({ message })
    }

    scrollToBottom = () => {
        if (this.messagesEnd && this.messagesEnd.scrollIntoView) {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        const { roomIndex, message } = this.state;
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
                            !auth.hasPermission &&
                            <Button icon={<MailOutlined />} type='danger' onClick={this.emailLogin.bind(this)} style={{ marginRight: '4px' }}>
                                이메일 {i18n.t('login')}
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
                    {
                        auth.messageRooms.map((messageRoom, index) => {
                            const lastmessage = messageRoom.messages.length ? messageRoom.messages[messageRoom.messages.length - 1] : {};
                            const roomUsers = messageRoom.users.reduce((acc, value) => {
                                if (value.id !== (auth.user || {}).id) acc.push(value);
                                return acc;
                            }, []);

                            return (
                                <div key={index} style={{ border: '1px solid grey', borderRadius: '8px', paddingLeft: '10px', marginBottom: '8px', overflow: 'hidden' }}>
                                    <Comment
                                        author={`${messageRoom.order.title} - ${roomUsers[0].username}${roomUsers.length > 1 ? ` 외 ${roomUsers.length - 1}명` : ''}`}
                                        avatar={<Avatar icon={<UserOutlined />} />}
                                        content={(lastmessage || {}).content || ''}
                                        datetime={<span>{lastmessage.created_at ? moment((lastmessage || {}).created_at).fromNow() : ''}</span>}
                                    />
                                    <Button type='primary' size='small' style={{ marginLeft: '-10px', width: 'calc(100% + 10px)' }} icon={<MessageOutlined />} onClick={() => {
                                        this.setState({ roomIndex: index, message: '' });
                                        environment.toggleSubDrawer();
                                    }} />
                                </div>
                            )
                        })
                    }
                    <Drawer
                        title={roomIndex !== undefined && auth.messageRooms[roomIndex].order.title || ''}
                        width='360px'
                        onClose={() => { environment.toggleSubDrawer(); }}
                        visible={environment.subDrawer}
                    >
                        <div style={{ height: 'calc(100% - 32px)', overflowY: 'scroll' }}>
                            <div style={{ paddingLeft: '12px', borderRadius: '4px', marginBottom: '4px', border: '1px solid grey', textAlign: 'center' }}>대화방이 생성되었습니다</div>
                            {
                                roomIndex !== undefined &&
                                auth.messageRooms[roomIndex].messages.map((message, index) => {
                                    const currentUser = auth.messageRooms[roomIndex].users.filter(user => user.id === message.from)[0];

                                    if ((currentUser || {}).id === auth.user.id) {
                                        return (
                                            <div key={index}>
                                                <Comment
                                                    author={`${(currentUser || {}).username || '-'}`}
                                                    content={message.content}
                                                    datetime={<span>{moment(message.created_at).fromNow()}</span>}
                                                    style={{ paddingLeft: '12px', borderRadius: '10px', marginBottom: '4px', border: '1px solid coral' }}
                                                />
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index}>
                                                <Comment
                                                    author={`${(currentUser || {}).username || '-'}`}
                                                    content={message.content}
                                                    datetime={<span>{moment(message.created_at).fromNow()}</span>}
                                                    style={{ paddingLeft: '12px', borderRadius: '10px', marginBottom: '4px', border: '1px solid cornflowerblue' }}
                                                />
                                            </div>
                                        )
                                    }
                                })
                            }
                            <div style={{ float: "left", clear: "both" }}
                                ref={(el) => { this.messagesEnd = el; }}>
                            </div>
                        </div>
                        <div style={{ height: '32px' }}>
                            <Input.Search
                                placeholder="내용을 입력해 주세요"
                                value={message}
                                enterButton={<MessageOutlined />}
                                onSearch={value => this.sendMessage(value)}
                                onChange={value => this.changeMessage(value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </Drawer>
                </Drawer>
            </div >
        );
    }
}

export default withTranslation('MainHeader')(MainHeader);