import useSWR from 'swr';
import { getApi } from './api';

const getPath = (path, query) => `/units/${path || ''}?${query || ''}`;

export const GetUnitsApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async getAll() {
            return await (await api.get(getPath("", "_sort=sort:ASC"))).data;
        },
    }
}