import useSWR from 'swr';
import { getApi } from './api';
import { formatDateForQuery } from '../../stores/dateStore';
import { addDays } from '../../stores/dateStore';

const getPath = (path, query) => `/food-plans/${path || ''}?${query || ''}`;

export const GetPlanApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async findCurrent() {
            const yesterday = addDays(new Date(), -1);
            return await (await api.get(getPath("", `validFrom_gt=${formatDateForQuery(yesterday)}`))).data;
        },
        async find(query) {
            return await api.get(getPath("", `_limit=10&title_contains=${query || ""}`));
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
            return await (await api.post(getPath(`${id}/shopping-list`)));
        }
    }
}