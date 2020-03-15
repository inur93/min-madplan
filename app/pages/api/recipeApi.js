import useSWR from 'swr';
import { getApi } from './api';

const getPath = (path, query) => `/recipes/${path || ''}?${query || ''}`;

export const GetRecipesApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async find(query){
            return await api.get(getPath("", `name_contains=${query}`));
        },
        async findOne(id) {
            return await api.get(getPath(id)).data;
        },
        async create(recipe){
            return await (await api.post(getPath(), recipe)).data;
        },
        async update(id, recipe){
            return await (await api.put(getPath(id), recipe)).data;
        }
    }
}