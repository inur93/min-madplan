'use strict';

/**
 * Module dependencies
 */

/* eslint-disable prefer-template */
// Public node modules.
const _ = require('lodash');
const sendgrid = require('@sendgrid/mail');

/* eslint-disable no-unused-vars */
module.exports = {
  provider: 'sendgrid custom',
  name: 'Sendgrid custom',
  auth: {
    sendgrid_default_from: {
      label: 'Sendgrid Default From Custom',
      type: 'text',
    },
    sendgrid_default_replyto: {
      label: 'Sendgrid Default Reply-To Custom',
      type: 'text',
    },
    sendgrid_api_key: {
      label: 'Sendgrid API Key',
      type: 'text',
    },
  },
  init: config => {
    sendgrid.setApiKey(config.sendgrid_api_key);

    return {
      send: options => {
        return new Promise((resolve, reject) => {
          // Default values.
          options = _.isObject(options) ? options : {};
          options.from = options.from || config.sendgrid_default_from;
          options.replyTo = options.replyTo || config.sendgrid_default_replyto;
          options.text = options.text || options.html;
          options.html = options.html || options.text;

          let msg = {
            from: options.from,
            to: options.to,
            replyTo: options.replyTo,
            subject: options.subject,
            text: options.text,
            html: options.html,
            templateId: options.templateId,
            dynamic_template_data: options.dynamic_template_data,
            sendAt: options.sendAt,
            batchId: options.batchId,
          };

          sendgrid.send(msg, function(err) {
            if (err) {
				console.log('error', {err});
              reject([{ messages: [
			  { id: err },
				  {sending: msg}
			  ] }]);
            } else {
              resolve();
            }
          });
        });
      },
    };
  },
};
