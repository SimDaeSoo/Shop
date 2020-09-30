import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import { initialize } from '../utils';
import { Layout, Button, message } from 'antd';
import Router from 'next/router';
import axios from 'axios';


@inject('auth')
@observer
class Type extends React.Component {
  setUpper = async () => {
    try {
      const { auth } = this.props;
      const headers = { Authorization: `bearer ${auth.jwt}` };
      await axios.put(`/api/users/${auth.user.id}`, { type: 'upper' }, { headers });
      Router.push(`/`);
    } catch (e) {
      message.error('요청에 실패했습니다');
    }
  }

  setUnder = async () => {
    try {
      const { auth } = this.props;
      const headers = { Authorization: `bearer ${auth.jwt}` };
      await axios.put(`/api/users/${auth.user.id}`, { type: 'under' }, { headers });
      Router.push(`/`);
    } catch (e) {
      message.error('요청에 실패했습니다');
    }
  }

  render() {
    return (
      <Layout className="layout" style={{ maxWidth: '1280px', width: '100%', margin: 'auto', height: '100%' }}>
        <Layout.Content>
          <div style={{ display: 'flex', textAlign: 'center', width: '100%', height: '100%', margin: 'auto' }}>
            <div style={{ display: 'inline-block', margin: 'auto' }}>
              <h2 style={{ color: '#AAAAAA' }}>사용자 유형을 선택해 주세요</h2>
              <Button type='primary' style={{ width: '240px', margin: '12px' }} onClick={this.setUpper}>발주업체</Button>
              <Button type='danger' style={{ width: '240px', margin: '12px' }} onClick={this.setUnder}>하청업체</Button>
            </div>
          </div>
        </Layout.Content>
      </Layout >
    );
  }
}

export async function getServerSideProps(context) {
  const initializeData = await initialize(context);
  return { props: { initializeData } };
}

export default withTranslation('Type')(Type);