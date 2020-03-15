import useSWR from 'swr';
import { getApi } from './api';

const getPath = (path, query) => `/recipe-items/${path || ''}?${query || ''}`;

export const GetRecipeItemsApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async find(query) {
            return await api.get(getPath('', `name_contains=${query}`));
            // const { data } = useSWR(getPath('', `name_contains=${query}`), path => {
            //     return api.get(path).catch(e => {
            //         console.error(e);
            //     });
            // });

            // if (!data || !data.data) return { isLoading: true };

            // return {
            //     isLoading: false,
            //     items: data.data || []
            // };
        },
    }
}