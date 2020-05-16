import { getApi } from './api';
import { toQueryStr } from '../functions/routerFunctions';

const getPath = (path, query) => `/group-invites/${path || ''}?${query || ''}`;

export const GetGroupInvitesApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async find(query) {
            return await (await api.get(getPath('', toQueryStr(query)))).data;
        },
        async accept(id) {
            return await (await api.put(getPath(`${id}/accept`))).data;
        },
        async decline(id) {
            return await (await api.put(getPath(`${id}/decline`))).data;
        },
        async count(query) {
            return await (await api.get(getPath(`count`, toQueryStr(query)))).data;
        }
    }
}