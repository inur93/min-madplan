'use strict';

const { sanitizeEntity } = require('strapi-utils');
const { getUserId, getCurrentGroup, mergeShoppingListItems } = require('../../../config/functions/helperFunctions');
const MODEL_ID = "food-plan";
const MODEL_ID_SHOPPING_LIST = 'shopping-list';
const MODEL_ID_UNITS = 'unit';
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const sanitize = (entity, options) => {
    const sanitized = sanitizeEntity(entity, options);
    if (!sanitized.plan) return sanitized;
    for (let i = 0; i < sanitized.plan.length; i++) {
        if (sanitized.plan[i].recipe) {
            delete sanitized.plan[i].recipe.ingredients;
            delete sanitized.plan[i].recipe.instructions;
        }
    }
    return sanitized;
}

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
            sanitize(entity, { model: strapi.models[MODEL_ID] }));
    },
    async create(ctx) {
        let entity;
        const userId = getUserId(ctx);
        const group = getCurrentGroup(ctx);

        const data = ctx.request.body;
        data.owner = userId;
        data.group = group;

        entity = await strapi.services[MODEL_ID].create(data);

        return sanitize(entity, { model: strapi.models[MODEL_ID] });
    },
    async findOne(ctx) {
        const entity = await strapi.query(MODEL_ID).model.findOne(
            { _id: ctx.params.id }
        );

        return sanitize(entity, { model: strapi.models[MODEL_ID] });
    },
    async createShoppingList(ctx) {
        const group = getCurrentGroup(ctx);
        const userId = getUserId(ctx);
        const { _id, name, plan, validFrom } = await strapi.services[MODEL_ID].findOne(ctx.params);
        const units = await strapi.services[MODEL_ID_UNITS].find();

        //get list of ingredients list and attach recipe name on each ingredient
        const ingredientsGroupedOnPlan = plan.map(
            p => p.recipe && p.recipe.ingredients
                .map(i => ({
                    ...i,
                    recipe: p.recipe.title,
                    date: p.date
                }))
        );
        // flatten ingredients list to 1 dimension
        let items = mergeShoppingListItems([].concat(...ingredientsGroupedOnPlan), units);

        const shoppingList = {
            validFrom,
            name,
            group,
            owner: userId,
            extra: {
                recipes: plan.filter(x => x.recipe).map(x => x.recipe.title),
                items
            },
            food_plan: _id
        }
        const entity = await strapi.services[MODEL_ID_SHOPPING_LIST].create(shoppingList);
        return sanitizeEntity(entity, { model: strapi.models[MODEL_ID_SHOPPING_LIST] });
    }
};
