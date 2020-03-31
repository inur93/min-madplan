'use strict';
const { sanitizeEntity, buildQuery, parseMultipartData } = require('strapi-utils');
const ObjectId = require('bson-objectid');
const getUserId = require('../../../config/functions/helperFunctions').getUserId;
const MODEL_ID = "page-settings";
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    async find(ctx){
        const entities = await strapi.query(MODEL_ID).model.find({});
        console.log('entities', entities);
        const entity = entities.length > 0 ? entities[0] : null;
        return sanitizeEntity(entity, { model: strapi.models[MODEL_ID] });
    }
};
