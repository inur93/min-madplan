

export const routeUpdate = (router, params) => {

    const query = Object.keys(params).reduce((query, key) => {
        query[key] = params[key];
        return query;
    }, router.query);

    router.replace({
        pathname: router.pathname,
        query,
    }, {
        shallow: true
    });
}

export function toQueryStr(obj) {
    return Object.keys(obj).reduce((query, key) => {
        return `${key}=${obj[key]}&${query}`;
    }, "");
}