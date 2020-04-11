import axios from 'axios';

const getBaseUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        return 'https://min-madplan.herokuapp.com/';
    }
    return process.browser ? 'http://localhost:1337/' : 'http://cms:1337/';
}

export const getApi = (ctx) => axios.create({
    baseURL: getBaseUrl(),
    transformRequest: [function (data, headers) {
        const jwt = getCookie(ctx);
        if (jwt) {
            headers.common['Authorization'] = `Bearer ${jwt}`;
            //headers.common['cookie'] = 
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


