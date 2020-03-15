import useSWR from 'swr';
import { getApi } from './api';

const getPath = (path, query) => `/shopping-lists/${path || ''}?${query || ''}`;

export const GetShoppingListApi = (ctx) => {
    const api = getApi(ctx);

    return {
        myShoppingLists() {
            const { data } = useSWR(getPath(), path => {
                return api.get(path).catch(e => {
                    console.error(e);
                });
            });

            if (!data || !data.data) return { isLoading: true };

            return {
                isLoading: false,
                shoppingLists: data.data || []
            };
        },

        async createShoppingList(shoppingList) {
            return await api.post(getPath(), shoppingList);
        },

        async updateShoppingList(id, shoppingList) {
            return await api.put(getPath(id), shoppingList);
        },

        async getShoppingList(id) {
            return await api.get(getPath(id)).catch(e => {
                console.error(e);
            })

        }
    }
}