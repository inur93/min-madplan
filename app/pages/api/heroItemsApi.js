import useSWR from 'swr';
import { getApi } from './api';


export const HeroItemsApi = () => {
    const api = getApi();
    return {
        async heroItems() {
            const { data } = await api.get('/hero-teasers?_sort=order:ASC');
            return data || [];
        }
    }
}