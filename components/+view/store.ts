import { ObjectApi, ObjectStore } from '../../core';
import { apiManager } from '../../core/api.manager';
import { Base } from '../../core/resource';
import { baseApi } from '../api';

export class View extends Base {
    options: any;

    constructor(data: any) {
        super()
        Object.assign(this, data);
    }
}

export const viewApi = new ObjectApi({
    kind: View.kind,
    isNs: false,
    apiBase: '/apis/ddx2x.nip/v1/view',
    objectConstructor: View,
    request: baseApi,
});

export class ViewStore extends ObjectStore<View> {
    api: ObjectApi<View>;
    constructor(api) {
        super();
        this.api = api;
    }
}

export const viewStore = new ViewStore(viewApi);

apiManager.registerStore(viewApi, viewStore);
