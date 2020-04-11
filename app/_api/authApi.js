import cookie from 'js-cookie';
import ServerCookie from 'next-cookies';
import { getApi } from './api';

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

export const forgotPassword = async function ({ email }) {
    return await getApi().post('/auth/forgot-password', {
        email,
    });
}

export const resetPassword = async function (data) {
    return await getApi().post('/auth/reset-password', data);
}

export const auth = ctx => {
    const { jwt: token } = ServerCookie(ctx);
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
    window.location.href = '/login';
}
