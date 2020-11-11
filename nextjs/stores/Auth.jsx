import { observable, action } from 'mobx';
import { message } from 'antd';
import axios from 'axios';

class Auth {
    @observable jwt = '';
    @observable user = {};
    @observable messageRooms = [];
    @observable initialize = false;

    constructor(initializeData) {
        this.jwt = initializeData.jwt;
        this.user = initializeData.user;
    }

    @action logout() {
        this.jwt = '';
        this.user = {};
        if (process.browser) this._setCookie('jwt', '');
    }

    async fetchData() {
        if (!this.jwt || !(this.user || {}).id) return;
        const headers = { Authorization: `bearer ${this.jwt}` };
        const { data } = await axios.get(`/api/message-rooms?users_in=${this.user.id}&_limit=99999`, { headers });

        if (data.length !== this.messageRooms.length && this.initialize === true) {
            message.info('새로운 발주지원이 추가되었습니다!..');
        }

        const _pastTotalMessageCount = (this.messageRooms || []).reduce((acc, val) => {
            acc += ((val || {}).messages || []).filter(v => v.from !== this.user.id).length;
            return acc;
        }, 0);

        const _currentTotalMessageCount = (data || []).reduce((acc, val) => {
            acc += ((val || {}).messages || []).filter(v => v.from !== this.user.id).length;
            return acc;
        }, 0);

        if (_currentTotalMessageCount !== _pastTotalMessageCount && this.initialize === true) {
            message.info('새로운 메세지가 왔습니다 확인해주세요!');
        }

        this.initialize = true;
        this.messageRooms = data;
    }

    async sendMessage(content, from, message_room) {
        const { data } = await axios.post(`/api/messages`, { content, from, message_room });
        return data;
    }

    async createRoom(order) {
        const { data } = await axios.get(`/api/message-rooms?users_in=${this.user.id}&order=${order.id}`);
        const response = await axios.get(`/api/orders/${order.id}`);
        const _order = response.data;
        
        if (!_order.ordering) {
            _order.ordering = true;
            await axios.put(`/api/orders/${_order.id}`, _order);
        }

        if (!data.length) {
            await axios.post(`/api/message-rooms`, {
                users: [order.user.id, this.user.id],
                order: order.id,
                messages: []
            });
            await this.fetchData();
        }
    }

    get hasPermission() {
        return (this.jwt && this.user);
    }

    get carried() {
        return this.user.carried_orders || [];
    }

    get liked() {
        return this.user.liked_orders || [];
    }

    _getCookie(name) {
        name = new RegExp(name + '=([^;]*)');
        return name.test(document.cookie) ? unescape(RegExp.$1) : '';
    }

    _setCookie(name, value, d) {
        document.cookie = name + '=' + escape(value) + '; path=/' + (d ? '; expires=' + (function (t) { t.setDate(t.getDate() + d); return t })(new Date).toGMTString() : '');
    }
}

export default Auth;