import { JsonApi } from '../../core';

export const welcomeApi = new JsonApi({
    debug: true,
    apiPrefix: '/welcome',
});
