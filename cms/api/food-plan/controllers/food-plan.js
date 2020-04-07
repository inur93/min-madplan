'use strict';

const { sanitizeEntity, buildQuery, parseMultipartData } = require('strapi-utils');
const { getUserId, getCurrentGroup, groupBy, sum } = require('../../../config/functions/helperFunctions');
const MODEL_ID = "food-plan";
const MODEL_ID_SHOPPING_LIST = 'shopping-list';
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */


module.exports = {
    async find(ctx) {
        const userId = getUserId(ctx);
        const group = getCurrentGroup(ctx);
        const query = {
            group: group
        };
        if (ctx.query.validFrom_gt) {
            query.validFrom = { $gt: ctx.query.validFrom_gt }
        }

        const entities = await strapi.query(MODEL_ID).model.find(query);

        return entities.map(entity =>
            sanitizeEntity(entity, { model: strapi.models[MODEL_ID] }));
    },
    async create(ctx) {
        let entity;
        const userId = getUserId(ctx);
        const group = getCurrentGroup(ctx);

        const data = ctx.request.body;
        data.owner = userId;
        data.group = group;
        
        entity = await strapi.services[MODEL_ID].create(data);

        return sanitizeEntity(entity, { model: strapi.models[MODEL_ID] });
    },
    async findOne(ctx) {
        const entity = await strapi.services[MODEL_ID].findOne(ctx.params);
        return sanitizeEntity(entity, { model: strapi.models[MODEL_ID] });
    },
    async createShoppingList(ctx) {
        const group = getCurrentGroup(ctx);
        const userId = getUserId(ctx);
        const { _id, name, plan, validFrom } = await strapi.services[MODEL_ID].findOne(ctx.params);

        const rawList = plan.map(p => p.recipe && p.recipe.ingredients);
        let ingredients = [].concat(...rawList);

        const itemsGrouped = groupBy(ingredients.map(i => ({
            name: i.name,
            unit: i.unit,
            amount: i.amount
        })), x => ({ name: x.name, unit: x.unit }));

        const items = itemsGrouped.map(x => ({
            name: x.key.name,
            unit: x.key.unit,
            amount: sum(x.values, 'amount')
        }))
            .filter(x => x.amount != 0);


        const shoppingList = {
            validFrom,
            name,
            group,
            owner: userId,
            items,
            food_plan: _id
        }
        const entity = await strapi.services[MODEL_ID_SHOPPING_LIST].create(shoppingList);
        return sanitizeEntity(entity, { model: strapi.models[MODEL_ID_SHOPPING_LIST] });
    }
};
