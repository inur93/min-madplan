'use strict';
const { sanitizeEntity, buildQuery, parseMultipartData } = require('strapi-utils');
const ObjectId = require('bson-objectid');
const { getUserId, getUserEmail } = require('../../../config/functions/helperFunctions');
const MODEL_ID = 'group-invite';
const MODEL_ID_GROUPS = 'group';
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

function doesRequestIncludeMe(ctx) {
    const myEmail = getUserEmail(ctx);
    const myId = getUserId(ctx);
    //validate request
    if (myEmail !== ctx.query.email && ctx.query.from !== myId.toString()) {
        return false;
    }
    return true;
}

module.exports = {
    async find(ctx) {
        if (!doesRequestIncludeMe(ctx)) return null;

        const entities = await strapi.services[MODEL_ID].find(ctx.query);
        return entities.map(e =>
            sanitizeEntity(e, { model: strapi.models[MODEL_ID] }));
    },
    async accept(ctx) {
        const userId = getUserId(ctx);
        const invite = await strapi.services[MODEL_ID].findOne(ctx.params);

        const [group, update] = await Promise.all([
            strapi.query(MODEL_ID_GROUPS).update(
                { _id: invite.group },
                {
                    $addToSet: { users: userId }
                }),
            strapi.query(MODEL_ID).update(
                { _id: invite._id },
                {
                    status: 'accepted'
                })
        ]);

        return sanitizeEntity(update, { model: strapi.models[MODEL_ID] });

    },
    async decline(ctx) {
        const invite = await strapi.services[MODEL_ID].findOne(ctx.params);

        const [group, update] = await strapi.query(MODEL_ID).model.update(
            { _id: invite._id },
            {
                status: 'declined'
            });

        return sanitizeEntity(update, { model: strapi.models[MODEL_ID] });
    },
    async count(ctx) {
        if (!doesRequestIncludeMe(ctx)) {
            return null;
        }
        return await strapi.services[MODEL_ID].count(ctx.query);
    }
};
