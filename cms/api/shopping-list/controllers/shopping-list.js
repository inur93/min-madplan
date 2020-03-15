'use strict';
const { sanitizeEntity, buildQuery, parseMultipartData } = require('strapi-utils');
const ObjectId = require('bson-objectid');
const MODEL_ID = "shopping-list";

const getUserId = (ctx) => ObjectId(ctx.state.user.id);
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find(ctx) {
        const userId = getUserId(ctx);

        const entities = await strapi.query(MODEL_ID).model.find({
            'validFrom': { $gt: '2020-02-20' }
        })
            .or([
                { 'owner': userId },
                { 'shared_with': userId }
            ]);

        return entities.map(entity =>
            sanitizeEntity(entity, { model: strapi.models[MODEL_ID] }));
    },
    async create(ctx) {
        let entity;
        const userId = getUserId(ctx);
        // if (ctx.is('multipart')) {
        //     const { data, files } = parseMultipartData(ctx);
        //     data.owner = userId;
        //     entity = await strapi.services[MODEL_ID].create(data, { files });
        // } else {
        const data = ctx.request.body;
        data.owner = userId;
        data.validTo = new Date(new Date(data.validFrom).getTime() + 60 * 60 * 24 * 7 * 1000);
        entity = await strapi.services[MODEL_ID].create(data);

        return sanitizeEntity(entity, { model: strapi.models[MODEL_ID] });
    },
    async findOne(ctx) {
        const entity = await strapi.services[MODEL_ID].findOne(ctx.params);
        return sanitizeEntity(entity, { model: strapi.models[MODEL_ID] });
    }
};
