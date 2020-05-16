import { getApi } from './api';

const getPath = (path, query) => `/groups/${path || ''}?${query || ''}`;

export const GetGroupsApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async find() {
            return await (await api.get(getPath())).data;
        },
        async leave(id) {
            return await (await api.put(getPath(`${id}/leave`))).data;
        },
        async findOne(id) {
            return await (await api.get(getPath(id))).data;
        },
        async create(group) {
            return await (await api.post(getPath(), group)).data;
        },
        async update(id, group) {
            return await (await api.put(getPath(id), group)).data;
        }
    }
}