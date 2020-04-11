import { getApi } from './_api';

const getPath = (path, query) => `/users/${path || ''}?${query || ''}`;

export const GetUsersApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async self() {
            return await (await api.get(getPath("me"))).data;
        },
        async update(id, data) {
            return await (await api.put(getPath(id), data));
        }
    }
}