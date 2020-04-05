'use strict';
const { sanitizeEntity, buildQuery, parseMultipartData } = require('strapi-utils');
const ObjectId = require('bson-objectid');
const { getUserId, getUserService } = require('../../../config/functions/helperFunctions');
const MODEL_ID = "group";
const MODEL_ID_USER = "users";
const MODEL_ID_INVITE = 'group-invite';
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find(ctx) {
        const userId = getUserId(ctx);

        const entities = await strapi.query(MODEL_ID).model.find({
            'users': userId
        });

        return entities.map(e =>
            sanitizeEntity(e, { model: strapi.models[MODEL_ID] }));
    },
    async create(ctx) {
        const userId = getUserId(ctx);
        const data = ctx.request.body;

        data.owner = userId;
        data.users = [userId];
        const entity = await strapi.services[MODEL_ID].create(data);
        let promises = [];
        for (let i = 0; i < entity.groupInvites.length; i++) {
            let invite = {
                status: 'sent',
                foodPlan: entity._id,
                email: data.groupInvites[i].email
            }
            let p = strapi.services[MODEL_ID_INVITE].create(invite);
            promises.push(p);
        }
        await Promise.all(promises);

        return sanitizeEntity(entity, { model: strapi.models[MODEL_ID] })
    }
};
