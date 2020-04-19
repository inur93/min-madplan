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

export const GetAuthApi = (ctx) => {
    const api = getApi(ctx, true);
    return {
        async login({ username, password }) {
            try {
                let { data } = await api.post('/auth/local', {
                    identifier: username,
                    password
                });
                if (!data) return false;
                setUserAndToken(data.user, data.jwt);
                return true;
            } catch (err) {
                return false;
            }
        },
        async forgotPassword({ email }) {
            return await api.post('/auth/forgot-password', {
                email,
            });
        },
        async resetPassword(data) {
            return await api.post('/auth/reset-password', data);
        },

    }
}

export const logout = () => {
    cookie.remove("jwt");
    cookie.remove('user');
    window.location.href = '/login';
}
