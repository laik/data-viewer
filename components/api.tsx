import { JsonApi } from '../core';

export const baseApi = new JsonApi({
    debug: true,
    apiPrefix: '/base',
});
