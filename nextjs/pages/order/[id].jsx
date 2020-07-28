import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import { initialize } from '../../utils';
import { Button } from 'antd';
import axios from 'axios';

@inject('environment', 'auth')
@observer
class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        if (process.browser) {
            this.initialize();
        }
        const { order } = this.props;
        this.state = { order };
    }

    initialize() {
        const IMP = window.IMP;
        IMP.init("imp99962599");
    }

    pay() {
        IMP.request_pay({
            pg: "kakao",
            pay_method: "card",
            merchant_uid: 'merchant_' + new Date().getTime(),
            name: "주문명: 결제 테스트'",
            amount: 100,
            buyer_email: "tlaeotn123@gmail.com",
            buyer_name: "심대수",
            buyer_tel: "010-3192-8053",
            buyer_addr: "서울특별시 성북구 보문동",
            buyer_postcode: "01181"
        }, (rsp) => {
            if (rsp.success) {
            } else {
            }
        });
    }

    render() {
        const { order } = this.state;
        return (
            <div>
                {JSON.stringify(order)}
                <span>상세페이지 작업해야함.</span>
                <Button type='primary' onClick={this.pay.bind(this)}>Kakao Pay 테스트</Button>
            </div>
        );
    }
}

async function getOrder(id) {
    const response = await axios.get(`${process.env.SSR_API_URL}/orders/${id}`);
    return response.data || {};
}

export async function getServerSideProps(context) {
    const initializeData = await initialize(context);
    const order = await getOrder(context.query.id);
    return { props: { initializeData, order } };
}

export default withTranslation('OrderDetail')(OrderDetail);