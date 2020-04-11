import axios from 'axios';
import cookie from 'js-cookie';
import ServerCookie from 'next-cookies';

export const getBaseUrl = () => {
    return process.browser ?
        process.env.BASE_URL || 'http://localhost:1337/' :
        process.env.BASE_URL || 'http://cms:1337/';
}


function parseJwt(token) {
    if (!token) return;
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
const validateCookie = (token) => {
    try {
        const parsed = parseJwt(token);
        return true;
    } catch (e) {
        console.error('error in cookie', e);
        return false;
    }
}
const getCookie = (ctx) => {
    if (ctx) {
        return ServerCookie(ctx).jwt;
    } else {
        const jwt = cookie.get('jwt');
        if (validateCookie(jwt)) {
            return jwt;
        }

        if (jwt && !ctx) {
            cookie.remove('jwt');
        }
    }
    return false;
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


