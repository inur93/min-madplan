import axios from 'axios';
import cookie from 'js-cookie';
import ServerCookie from 'next-cookies';

const getCookie = (ctx) => ctx ? ServerCookie(ctx).jwt : cookie.get('jwt');
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
        console.log("jwt", jwt);
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

export const username = () => {
    return "admin";
}

export const isAuthenticated = () => {
    //if(typeof window === 'undefined') return false;
    const jwt = cookie.get("jwt");
    if (!jwt) {
        console.log('not authenticated');
        return false;
    }
    const parts = jwt.split('.');
    const claims = JSON.parse(atob(parts[1]));
    const authenticated = claims.exp * 1000 > Date.now;
    if (!authenticated) {
        cookie.remove("jwt");
        cookie.remove("user");
    }
    console.log('is authenticated: ' + authenticated);
    return authenticated;
}