import { getApi } from './api';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';
import Router from 'next/router';

const setUserAndToken = (user, token) => {
    cookie.set("user", user && JSON.stringify(user), { expires: 7 });
    cookie.set("jwt", token && token, { expires: 7 });
    console.log(cookie);
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
    console.log('auth: ', {token})
    if (ctx.req && !token) {
        console.log('redirecting to login...');
        ctx.res.writeHead(302, { Location: '/login' })
        ctx.res.end()
        return
    }
    cookie.set('jwt', token, {expires: 7});
    console.log("all is good.. returning token");
    return token;
}

export const logout = () => {
    cookie.remove("jwt");
    Router.push("/");
}

