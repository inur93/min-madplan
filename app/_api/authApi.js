import cookie from 'js-cookie';
import { getJwtToken, validateToken } from '../functions/tokenFunctions';
import { getApi } from './api';

const setUserAndToken = (user, token) => {
    if (user) {
        cookie.set("user", JSON.stringify(user), { expires: 7 });
    }
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
//use only server side
export const auth = ctx => {
    const token = getJwtToken(ctx);

    if (!token) {
        ctx.res.writeHead(302, { Location: '/login' })
        ctx.res.end();
        return null;
    } else if (validateToken(token)) {
        cookie.set('jwt', token, { expires: 7 });
    } else {
        cookie.remove('jwt');
        return null;
    }
    return token;
}

export const logout = () => {
    cookie.remove("jwt");
    cookie.remove('user');
    window.location.href = '/login';
}
