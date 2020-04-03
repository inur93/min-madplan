import useSWR from 'swr';
import { getApi } from './api';

const getPath = (path, query) => `/shopping-lists/${path || ''}?${query || ''}`;

export const GetShoppingListApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async myShoppingLists() {
            return await (await api.get(getPath())).data;
        },
        async latestShoppingList() {
            
        },
        async createShoppingList(shoppingList) {
            return await (await api.post(getPath(), shoppingList)).data;
        },

        async updateShoppingList(id, shoppingList) {
            return await (await api.put(getPath(id), shoppingList)).data;
        },

        async getShoppingList(id) {
            return await (await api.get(getPath(id))).data

        }
    }
}