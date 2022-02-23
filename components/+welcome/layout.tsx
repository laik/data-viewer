import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { NextRouter } from 'next/router';
import React from 'react';
import { storeables } from '../../core/store.wrap';
import { bossStore } from './store';

interface RouterProps {
    router: NextRouter;
}

export interface WelcomeProps extends RouterProps { }
@observer
@storeables([bossStore], false) // 注入多个store，可以自动loadAll与watch数据
export default class Welcome<P extends WelcomeProps> extends React.Component<P> {

    @observable static data: {

    } = {};

    defaultSortInfo: { name: string };

    render() {
        const { name } = this.defaultSortInfo;
        return (<div>welcome</div >)
    }
}