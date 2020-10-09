import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import Router from 'next/router';
import axios from 'axios';

@inject('environment', 'auth')
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };
  }

  changeEmail(e) {
    const email = e.target.value;
    this.setState({ email });
  }

  changePassword(e) {
    const password = e.target.value;
    this.setState({ password });
  }

  async login() {
    const { email, password } = this.state;
    const { data } = await axios.post(`/api/auth/local`, { identifier: email, password: password });
    const { auth } = this.props;

    if (data.jwt) {
      auth.jwt = data.jwt;
      auth.user = data.user;
      auth._setCookie('jwt', data.jwt);
      Router.push(`/`);
    } else {
      message.error('잘못된 정보입니다. 이메일 / 패스워드를 확인해 주세요.');
    }
  }

  render() {
    const { email, password } = this.state;

    return (
      <div style={{ height: '100%', display: 'flex' }}>
        <div style={{ width: '300px', maxHeight: '90%', margin: 'auto' }}>
          <Input value={email} onChange={e => this.changeEmail(e)} placeholder="이메일" prefix={<MailOutlined />} />
          <Input.Password value={password} onChange={e => this.changePassword(e)} placeholder="비밀번호" />
          <Button type='primary' onClick={() => this.login()} style={{ width: '100%' }}>로그인</Button>
        </div>
      </div>
    );
  }
}

export default Login;