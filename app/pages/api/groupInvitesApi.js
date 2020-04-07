import useSWR from 'swr';
import { getApi } from './api';

const getPath = (path, query) => `/group-invites/${path || ''}?${query || ''}`;

export const GetGroupInvitesApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async myInvites() {
            return await (await api.get(getPath())).data;
        },
        async find() {
            return await (await api.get(getPath())).data;
        },
        async accept(id) {
            return await (await api.put(getPath(`${id}/accept`))).data;
        },
        async decline(id) {
            return await (await api.put(getPath(`${id}/decline`))).data;
        },
        async count() {
            return await (await api.get(getPath(`count`))).data;
        }
    }
}