
const ObjectId = require('bson-objectid');

function getConversionTable(units) {
    return units.reduce((map, value) => {
        map[value.name] = value.conversionTable || {};
        return map;
    }, {});
}
module.exports = {
    getUserId(ctx) {
        return ObjectId(ctx.state.user.id);
    },
    getUserEmail(ctx) {
        return ctx.state.user.email;
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
    getUserService(strapi) {
        return strapi.plugins['users-permissions'].controllers['user'];
    },
    getConversionTable,
    mergeShoppingListItems(ingredients, units, existingList = []) {
        const conversionTable = getConversionTable(units);
        return ingredients.reduce((items, ingredient) => {
            //check if amount is specified - no need to add 0 of anything
            if (!ingredient.amount) return items;

            //check if item already exists on list
            let existing = items.find(x => x.name === ingredient.name);

            const part = {
                key: ObjectId().toString(),
                name: ingredient.recipe,
                date: ingredient.date,
                amount: ingredient.amount,
                unit: ingredient.unit
            }
            //if not add it and return
            if (!existing) {
                items.push({
                    name: ingredient.name,
                    unit: ingredient.unit,
                    amount: ingredient.amount,
                    key: ObjectId().toString(),
                    parts: [part]

                })
                return items;
            }

            //try to convert units and merge
            //e     i            e          i
            //dl -> l  -> 0.1 -- dl * 0.1 = l
            //i     e            i          e
            //l  -> dl -> 10  -- l  * 10  = dl
            const existingToItem = (conversionTable[existing.unit] || {})[ingredient.unit];
            const itemToExisting = (conversionTable[ingredient.unit] || {})[existing.unit];
            if (existingToItem && itemToExisting) {
                if (existingToItem < itemToExisting) {
                    existing.unit = ingredient.unit;
                }
            }
            //update recipe link info
            existing.parts.push(part)

            return items;

        }, existingList);
    }
}
