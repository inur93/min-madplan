'use strict';

const { sanitizeEntity, buildQuery, parseMultipartData } = require('strapi-utils');
const { getUserId, getCurrentGroup, groupBy, sum } = require('../../../config/functions/helperFunctions');
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

        const conversionTable = units.reduce((map, value) => {
            map[value.name] = value.conversionTable || {};
            return map;
        }, {});

        //get list of ingredients list and attach recipe name on each ingredient
        const rawList = plan.map(
            p => p.recipe
                && p.recipe.ingredients
                    .map(i => ({ recipe: p.recipe.title, ...i }))
        );
        // flatten ingredients list to 1 dimension
        let ingredients = [].concat(...rawList);

        //group the ingredients by name in case same ingredient exists on multiple recipes.
        const itemsGroupedByName = groupBy(ingredients.map(i => ({
            name: i.name,
            unit: i.unit,
            amount: i.amount,
            recipe: i.recipe
        })), x => ({ name: x.name }));

        //make conversions for each group if ingredient is weighed with different units
        const itemsGrouped = itemsGroupedByName.map(group => {

            //merge values if possible
            group.values = group.values.reduce((arr, item) => {
                const same = arr.find(x => x.unit === item.unit);
                const target = arr.find(x => (conversionTable[x.unit] || {})[item.unit]);
                const source = arr.find(x => (conversionTable[item.unit] || {})[x.unit]);
                let selectedAmount;
                let selectedItem;

                if (same) {
                    selectedAmount = item.amount;
                    selectedItem = same;
                } else if (target) {
                    selectedAmount = item.amount / conversionTable[target.unit][item.unit];
                    selectedItem = target;
                } else if (source) {
                    selectedAmount = conversionTable[item.unit][source.unit] * item.amount;
                    selectedItem = source;
                } else {
                    selectedItem = {
                        name: item.name,
                        unit: item.unit,
                        extra: { recipes: [] },
                        amount: 0
                    };
                    selectedAmount = item.amount;
                    arr.push(selectedItem);
                }

                selectedItem.extra.recipes.push({ recipe: item.recipe, amount: item.amount, unit: item.unit });
                selectedItem.amount += selectedAmount;
                return arr;
            }, []);
            return group;
        });

        //unwind merged items
        const items = itemsGrouped.reduce((arr, group) => {
            const unwind = group.values.map(value => {
                //TODO try to optimize chosen unit fx use kg if more than 1000 g.
                return {
                    name: group.key.name,
                    unit: value.unit,
                    extra: value.extra,
                    amount: value.amount
                }
            })
            return arr.concat(unwind);
        }, [])
            //removes salt and pepper etc which is not specified with an amount
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
