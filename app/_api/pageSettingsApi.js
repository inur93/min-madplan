import { getApi } from './api';


export const GetPageSettingsApi = (ctx) => {
    const api = getApi(ctx, true);
    return {
        async get(section) {
            const { data } = await api.get('/page-settings');
            if (section) return data[section];
            return data;
        }
    }
}