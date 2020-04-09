import axios from 'axios';
import cookie from 'js-cookie';
import ServerCookie from 'next-cookies';

function parseJwt(token) {
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


const setUserAndToken = (user, token) => {
    cookie.set("user", user && JSON.stringify(user), { expires: 7 });
    if (token) {
        cookie.set("jwt", token, { expires: 7 });
    }
}

export const login = async function ({ username, password }) {
    try {
        let { data } = await getApi().post('/auth/local', {
            identifier: username,
            password
        });
        if (!data) return false;
        setUserAndToken(data.user, data.jwt);
        return true;
    } catch (err) {
        return false;
    }
}

export const auth = ctx => {
    const { jwt: token } = nextCookie(ctx);
    if (ctx.req && !token) {
        ctx.res.writeHead(302, { Location: '/login' })
        ctx.res.end();
        return false;
    }
    cookie.set('jwt', token, { expires: 7 });
    return token;
}

export const logout = () => {
    cookie.remove("jwt");
    cookie.remove('user');
    Router.push("/login");
}

