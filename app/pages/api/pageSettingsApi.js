import useSWR from 'swr';
import { getApi } from './api';


export const GetPageSettingsApi = (ctx) => {
    const api = getApi(ctx);
    return {
        async get(section) {
            const { data } = await api.get('/page-settings');
            console.log('data', data);
            if(section) return data[section];
            return data;
        },
        async frontPage() {
            try {
                const { data, ...others } = await api.get('/page-settings');
                if (data) {
                    return data.frontPage;
                }
                return {};
            } catch (e) {
                console.log('error getting front page settings');
            }
            return {};
        }
    }
}