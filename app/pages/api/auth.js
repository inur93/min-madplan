import { getApi } from './api';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';
import Router from 'next/router';

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

