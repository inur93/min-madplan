import { getApi } from './api';

const getPath = (path, query) => `/product-items/${path || ''}?${query || ''}`;

export const GetProductItemsApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async find(query) {
            return await api.get(getPath('', `name_contains=${query}&_limit=10`));
        },
    }
}