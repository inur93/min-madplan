'use strict';
const { sanitizeEntity } = require('strapi-utils');
const ObjectId = require('bson-objectid');
const { getUserId, getConversionTable, mergeShoppingListItems } = require('../../../config/functions/helperFunctions');
const MODEL_ID = "shopping-list";
const MODEL_ID_FOOD_PLAN = "food-plan";
const MODEL_ID_UNITS = 'unit';
const MODEL_ID_RECIPES = 'recipe';
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
    async update(ctx) {
        const data = ctx.request.body;
        const units = await strapi.services[MODEL_ID_UNITS].find();
        const conversionTable = getConversionTable(units);

        if (data.extra && data.extra.items) {
            data.extra.items = data.extra.items.reduce((array, item) => {
                if (item.recipes) {
                    //all recipe items have been removed from which this item was created.
                    //if creating manual item recipes should be null
                    if (item.recipes.length === 0) return array;

                    //this is the total amount and is calculated every time.
                    item.amount = item.parts.reduce((total, part) => {
                        const scale = ((part.unit && item.unit) ? conversionTable[part.unit][item.unit] : 1) || 1;
                        return total + (part.amount * scale);
                    }, 0);
                }
                array.push(item);
                return array;
            }, []);
        }
        const entity = await strapi.services[MODEL_ID].update(ctx.params, data);
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
    },
    async refresh(ctx) {
        const existing = await strapi.services[MODEL_ID].findOne(ctx.params);
        if (!existing.food_plan) return; //TODO throw somekind of error

        const foodPlan = await strapi.services[MODEL_ID_FOOD_PLAN].findOne({ _id: existing.food_plan._id });
        const recipes = foodPlan.plan.map(x => ({ ...x.recipe, date: x.date })).filter(x => !!x);
        const recipeNames = recipes.map(x => x.title);
        const currentRecipes = existing.extra.recipes;
        const toRemove = currentRecipes.filter(x => !recipeNames.includes(x));
        const toAdd = recipeNames.filter(x => !currentRecipes.includes(x)).map(x => recipes.find(y => y.title === x));

        let newItems = existing.extra.items;
        if (toRemove.length > 0) {
            //remove items
            newItems = newItems.reduce((arr, item) => {
                item.parts = item.parts.filter(x => !toRemove.includes(x.name))
                if (item.parts.length > 0) arr.push(item);
                return arr;
            }, []);
        }

        //add items
        if (toAdd.length > 0) {
            const units = await strapi.services[MODEL_ID_UNITS].find();
            const results = await strapi.query(MODEL_ID_RECIPES).model.find({})
                .in("_id", toAdd.map(x => x._id));
            let ingredientsGrouped = results.map(x => {
                const recipe = sanitizeEntity(x, { model: strapi.models[MODEL_ID_RECIPES] });
                const date = recipes.find(x => x._id.toString() === recipe._id.toString()).date;
                return recipe.ingredients.map(y => ({ ...y, recipe: recipe.title, date }));
            });

            const ingredients = [].concat(...ingredientsGrouped);

            newItems = mergeShoppingListItems(ingredients, units, newItems);
        }

        const entity = await strapi.query(MODEL_ID).model.updateOne(
            { _id: ctx.params.id },
            {
                $set: {
                    "extra.items": newItems,
                    "extra.recipes": recipeNames
                }
            });
        return sanitizeEntity(entity, { model: strapi.models[MODEL_ID] });
    }
};