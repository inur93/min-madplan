'use strict';
const { sanitizeEntity, buildQuery, parseMultipartData } = require('strapi-utils');
const { getUserId, getUserService, getUserEmail } = require('../../../config/functions/helperFunctions');
const MODEL_ID = "group";
const MODEL_ID_INVITE = 'group-invite';
const PLUGIN_ID_USER = 'users-permissions';
const MODEL_ID_USER = "user";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async leave(ctx) {
        const userId = getUserId(ctx);
        const group = await strapi.services[MODEL_ID].findOne(ctx.query);
        const user = await strapi.plugins[PLUGIN_ID_USER].services[MODEL_ID_USER].fetch({ id: userId });

        const users = group.users.map(x => x._id).filter(x => x != userId);
        const groups = user.groups.map(x => x._id).filter(x => x != group._id);

        await Promise.all([
            strapi.plugins[PLUGIN_ID_USER].services[MODEL_ID_USER].edit({ id: userId.toString() }, { groups: groups }),
            strapi.services[MODEL_ID].update({ id: group.id }, { users: users })
        ]);

        return {
            success: true
        }
    },
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
        for (let i = 0; i < data.groupInvites.length; i++) {
            let invite = {
                status: 'sent',
                group: entity._id,
                email: data.groupInvites[i].email,
                from: userId
            }
            let p = strapi.services[MODEL_ID_INVITE].create(invite);
            promises.push(p);
        }
        await Promise.all(promises);

        return sanitizeEntity(entity, { model: strapi.models[MODEL_ID] })
    },
    async invite(ctx) {
        const from = getUserId(ctx);
        const email = ctx.request.body.email;
        const groupId = ctx.query.id;

        const invite = await strapi.services[MODEL_ID_INVITE].create({
            status: 'sent',
            group: groupId,
            email,
            from
        });
        return sanitizeEntity(invite, { model: Strapi.models[MODEL_ID_INVITE] });
    }
};
