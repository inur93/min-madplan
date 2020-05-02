import axios from 'axios';
import { getJwtToken, validateToken } from '../functions/tokenFunctions';
import { isProduction } from '../functions/environmentFunctions';

export const getBaseUrl = () => {
    
    return process.browser ?
        (process.env.BASE_URL || 'http://localhost:1337') :
        (process.env.BASE_URL || 'http://cms:1337');
}

export const getApi = (ctx, excludeToken) => axios.create({
    baseURL: getBaseUrl(),
    transformRequest: [function (data, headers) {
        const jwt = getJwtToken(ctx);
        if (!excludeToken && validateToken(jwt)) {
            headers.common['Authorization'] = `Bearer ${jwt}`;
        }
        return data;
    }, axios.defaults.transformRequest[0]],
    transformResponse: [function (data, response) {
        //handle errors
        return JSON.parse(data)
    }
    ]
    // see https://github.com/axios/axios#axiosrequestconfig-1

});


