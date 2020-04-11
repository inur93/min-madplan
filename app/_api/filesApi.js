import { getApi } from './_api';

const getPath = () => `/upload`;

export const GetFilesApi = (ctx) => {
    const api = getApi(ctx);

    return {
        async upload(formdata) {
            return await (await api.post(getPath(), formdata)).data;
        }
    }
}