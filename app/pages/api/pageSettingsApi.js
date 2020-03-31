import useSWR from 'swr';
import { getApi } from './api';


export const GetPageSettingsApi = (ctx) => {
    const api = getApi(ctx);
    return {
        async frontPage() {
            try {
                const { data } = await api.get('/page-settings');
                if(data){
                    return data.frontPage;
                }
                return {};
            }catch(e){
                console.log('error', e);
            }
            return {};
        }
    }
}