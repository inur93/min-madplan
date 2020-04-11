import { getApi } from './_api';
import { addDays, formatDateForQuery } from '../functions/dateFunctions';

const getPath = (path, query) => `/food-plans/${path || ''}${query ? '?' : ''}${query || ''}`;

export const GetPlanApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async findCurrent() {
            const yesterday = addDays(new Date(), -1);
            const data = await (await api.get(getPath("", `validFrom_gt=${formatDateForQuery(yesterday)}`))).data;
            if(data && data.length > 0) return data[0];
            return null;
        },
        async find() {
            return await (await api.get(getPath("", `_limit=10&_sort=validFrom_asc`))).data || [];
        },
        async findOne(id) {
            return await (await api.get(getPath(id))).data;
        },
        async create(plan) {
            return await (await api.post(getPath(), plan)).data;
        },
        async update(id, plan) {
            return await (await api.put(getPath(id), plan)).data;
        },
        async createShoppingList(id) {
            return await (await api.post(getPath(`${id}/shopping-list`))).data;
        }
    }
}