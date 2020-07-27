import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import { initialize } from '../../utils';
import { Button } from 'antd';

@inject('environment', 'auth')
@observer
class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        if (process.browser) {
            this.initialize();
        }
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
        return (
            <div>
                Hello World?
                <Button type='primary' onClick={this.pay.bind(this)}>test</Button>
            </div>
        );
    }
}

export async function getServerSideProps(context) {
    const initializeData = await initialize(context);
    return { props: { initializeData } };
}

export default withTranslation('OrderDetail')(OrderDetail);