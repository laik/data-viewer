import { ObjectApi, ObjectStore } from '../../core';
import { apiManager } from '../../core/api.manager';
import { Base } from '../../core/resource';
import { baseApi } from '../api';

export class Boss extends Base {
    vin: string;
    static kind: string;

    constructor(props: any) {
        super(props)
        Object.assign(this, props);
    }
}

export const bossApi = new ObjectApi({
    kind: Boss.kind,
    isNs: false,
    apiBase: '/apis/ddx2x.nip/v1/boss',
    objectConstructor: Boss,
    request: baseApi,
});

export class BossStore extends ObjectStore<Boss> {
    api: ObjectApi<Boss>;
    constructor(api) {
        super();
        this.api = api;
    }
}

export const bossStore = new BossStore(bossApi);

apiManager.registerStore(bossApi, bossStore);
