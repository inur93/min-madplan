import { getApi } from './api';
import { formatDateForQuery } from '../functions/dateFunctions';

const getPath = (path, query) => `/shopping-lists/${path || ''}?${query || ''}`;

export const GetShoppingListApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async find() {
            return await (await api.get(getPath())).data;
        },
        async latest() {
            var today = formatDateForQuery(new Date());
            const { data } = await api.get(getPath('', `validFrom_gte=${today}&_sort=validFrom:asc&_limit=1`));
            if (data && data.length > 0) {
                return data[0];
            }
            return null;
        },
        async create(shoppingList) {
            return await (await api.post(getPath(), shoppingList)).data;
        },

        async update(id, shoppingList) {
            return await (await api.put(getPath(id), shoppingList)).data;
        },

        async findOne(id) {
            return await (await api.get(getPath(id))).data
        },
        async delete(id) {
            return await (await api.delete(getPath(id))).data;
        },
        async refresh(id) {
            return await (await api.put(getPath(`${id}/refresh`))).data;
        }
    }
}