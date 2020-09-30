import { observable, action } from 'mobx';
import { stringify } from 'querystring';
import Router from 'next/router';
import i18n from '../locales/i18n';

class Environment {
    @observable query = {};
    @observable mainDrawer = false;
    @observable subDrawer = false;

    constructor(initializeData) {
        this.query = initializeData.query;
        delete this.query.id;
        i18n.changeLanguage(this.language);
    }

    @action set(key, value) {
        if (this.query[key] !== value) {
            this.query[key] = value;

            if (this.query.language === 'ko') delete this.query.language;
            i18n.changeLanguage(this.language);
            Router.push(`${Router.asPath.split('?')[0]}${this.queryString}`);
        }
    }

    @action toggleMainDrawer() {
        console.log('hello');
        this.mainDrawer = !this.mainDrawer;
        console.log(this.mainDrawer);
    }

    @action toggleSubDrawer() {
        this.subDrawer = !this.subDrawer;
    }

    get language() {
        return this.query.language || 'ko';
    }

    get queryString() {
        const query = stringify(this.query);
        return query ? `?${query}` : '';
    }
}

export default Environment;