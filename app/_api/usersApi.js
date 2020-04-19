import { getApi } from './api';

const getPath = (path, query) => `/users/${path || ''}?${query || ''}`;

export const GetUsersApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async self() {
            try {
                const me = await (await api.get(getPath("me"))).data;
            } catch (e) {
                console.log('could not get self', e);
                return null;
            }
        },
        async update(id, data) {
            return await (await api.put(getPath(id), data));
        }
    }
}