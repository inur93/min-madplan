import { getApi } from './api';
import { formatDateForQuery } from '../functions/dateFunctions';

const getPath = (path, query) => `/shopping-lists/${path || ''}?${query || ''}`;

export const GetShoppingListApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async myShoppingLists() {
            return await (await api.get(getPath())).data;
        },
        async latestShoppingList() {
            var today = formatDateForQuery(new Date());
            const { data } = await api.get(getPath('', `validFrom_gte=${today}&_sort=validFrom:asc&_limit=1`));
            if (data && data.length > 0) {
                return data[0];
            }
            return null;
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