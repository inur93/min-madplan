
const ObjectId = require('bson-objectid');

module.exports = {
    getUserId(ctx) {
        return ObjectId(ctx.state.user.id);
    },
    getCurrentGroup(ctx) {
        return ctx.state.user.selectedGroup && ObjectId(ctx.state.user.selectedGroup);
    },
    groupBy(array, getKey) {
        return array.reduce(function (rv, x) {
            const key = getKey(x);
            const _key = JSON.stringify(key);
            let existing = rv.find(x => x._key === _key);
            if (existing) {
                existing.values.push(x);
            } else {
                rv.push({
                    _key,
                    key,
                    values: [x]
                })
            }
            return rv;
        }, []);
    },
    sum(array, key) {
        return array.reduce(function (total, x) {
            const val = x[key];
            const num = (!val || isNaN(val)) ? 0 : Number.parseFloat(val);
            return total + num;
        }, 0);
    },
    getUserService(strapi){
        return strapi.plugins['users-permissions'].controllers['user'];
    }
}
