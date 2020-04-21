'use strict';
const { sanitizeEntity, buildQuery, parseMultipartData } = require('strapi-utils');
const ObjectId = require('bson-objectid');
const getUserId = require('../../../config/functions/helperFunctions').getUserId;
const MODEL_ID = "shopping-list";
const MODEL_ID_FOOD_PLAN = "food-plan";
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
        const userId = getUserId(ctx);
        const data = ctx.request.body;
        data.owner = userId;
        const entity = await strapi.services[MODEL_ID].create(data);

        return sanitizeEntity(entity, { model: strapi.models[MODEL_ID] });
    },
    async findOne(ctx) {
        const entity = await strapi.services[MODEL_ID].findOne(ctx.params);
        return sanitizeEntity(entity, { model: strapi.models[MODEL_ID] });
    },
    async delete(ctx) {
        const { id } = ctx.params;
        const existing = await strapi.services[MODEL_ID].findOne(ctx.params);

        const entity = await strapi.services[MODEL_ID].delete({ id });
        if (existing.food_plan) {
            await strapi.query(MODEL_ID_FOOD_PLAN).model.update(
                { _id: existing.food_plan._id }, { $unset: { 'shopping_list': '' } }
            )
        }

        return sanitizeEntity(entity, { model: strapi.models[MODEL_ID] });
    }
};
