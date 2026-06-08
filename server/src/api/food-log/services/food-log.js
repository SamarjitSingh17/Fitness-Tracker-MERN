'use strict';

/**
 * food-log service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::food-log.food-log');
