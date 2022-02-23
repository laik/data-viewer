import { ObjectApi, ObjectStore } from '../../core';
import { apiManager } from '../../core/api.manager';
import { Base } from '../../core/resource';
import { welcomeApi } from './api';

export class Boss extends Base {
    VehicleSummer: number;

    constructor(data: any) {
        super()
        Object.assign(this, data);
    }
}

export const bossApi = new ObjectApi({
    kind: Boss.kind,
    isNs: false,
    apiBase: '/apis/ddx2x.nip/v1/boss',
    objectConstructor: Boss,
    request: welcomeApi,
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
