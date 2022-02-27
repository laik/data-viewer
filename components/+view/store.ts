import { IObject, ObjectApi, ObjectStore } from '../../core';
import { apiManager } from '../../core/api.manager';
import { Kind } from '../../core/object';
import { bind } from '../../core/utils';
import { baseApi } from '../api';
import { createCandlestickOption } from '../charts/options';


@bind()
export class View extends IObject {
    options: {
        xAxis: [];
        yAxis: [];
        data: [];
    };

    candlestick() {
        return createCandlestickOption(this.options.xAxis, this.options.yAxis, this.options.data);
    }
}

export const viewApi = new ObjectApi({
    kind: Kind(View),
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
