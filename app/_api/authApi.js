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
            let message;
            let success = false;
            try {
                let { data } = await api.post('/auth/local', {
                    identifier: username,
                    password
                });
                if (data) {
                    setUserAndToken(data.user, data.jwt);
                    success = true;
                }
            } catch (err) {
                switch (err.response.status) {
                    case 400:
                        message = 'Dit brugernavn eller kodeord er forkert';
                        break;
                    default:
                        message = 'Der skete en ukendt fejl. Prøv igen.';
                        break;
                }
            }
            return {
                success,
                message
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
