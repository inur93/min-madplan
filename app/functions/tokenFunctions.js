import cookie from 'js-cookie';
import ServerCookie from 'next-cookies';

export function parseJwt(token) {
    if (!token) return;
    try {
        const jsonString = Buffer.from(token.split('.')[1], 'base64').toString();
        return JSON.parse(jsonString);
    } catch (e) {
        console.log('error', e);
        return null;
    }
};

export function validateToken(token) {
    try {
        const parsed = parseJwt(token);
        if (!parsed) return false;
        return new Date(parsed.exp * 1000) > new Date();
    } catch (e) {
        console.error('error in cookie', e);
        return false;
    }
}

export function getJwtToken(ctx) {
    if (ctx) {
        return ServerCookie(ctx).jwt;
    } else {
        return cookie.get('jwt');
    }
}