'use strict';

/**
 * food-log controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::food-log.food-log', ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('Login required');
      }

      //   Get Data Sent From React
      const body = ctx.request.body.data;
    //   Attach Current User
      body.users_permissions_user = user.id;

      const entry = await strapi.entityService.create(
        'api::food-log.food-log',
        {
          data: body,
          populate: ['users_permissions_user'],
        //   populate is to get to which user the activity belongs
        }
      );

      return entry;
    },
    async find(ctx) {
       const user = ctx.state.user;

       const result = await strapi.entityService.findMany(
         "api::food-log.food-log",
         {
           filters: {
             users_permissions_user: user.id
           },
           populate: ["users_permissions_user"]
         }
       );

       return result;
    },
     async findOne(ctx) {
       const user = ctx.state.user;
       const { id } = ctx.params;

       const result = await strapi.entityService.findMany(
         "api::food-log.food-log",
         {
           filters: {
             id,
             users_permissions_user: user.id
           },
           populate: ["users_permissions_user"]
         }
       );

       if (!result.length)
         return ctx.notFound("Not found or not yours");

       return result[0];
}
  }));
