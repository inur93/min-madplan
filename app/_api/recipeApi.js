import { getApi } from './api';

const getPath = (path, query) => `/recipes/${path || ''}?${query || ''}`;

export const GetRecipesApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async find(query, start = 0, limit = 10){

            return await (await api.get(getPath("", `_start=${start}&_limit=${limit}&title_contains=${query || ""}`))).data;
        },
        async findOne(id) {
            return await (await api.get(getPath(id))).data;
        },
        async create(recipe){
            return await (await api.post(getPath(), recipe)).data;
        },
        async update(id, recipe){
            return await (await api.put(getPath(id), recipe)).data;
        },
        async count (query){
            return await (await api.get(getPath('count', `title_contains=${query || ''}`))).data;
        }
    }
}