import useSWR from 'swr';
import { getApi } from './api';

const getPath = (path, query) => `/food-plans/${path || ''}?${query || ''}`;

export const GetPlanApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async find(query){
            return await api.get(getPath("", `_limit=10&title_contains=${query || ""}`));
        },
        async findOne(id) {
            return await (await api.get(getPath(id))).data;
        },
        async create(recipe){
            return await (await api.post(getPath(), recipe)).data;
        },
        async update(id, recipe){
            return await (await api.put(getPath(id), recipe)).data;
        }
    }
}