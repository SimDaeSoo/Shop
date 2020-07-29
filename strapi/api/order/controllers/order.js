'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    buy: async ctx => {
        const { id } = ctx.params;
        const { quantity } = ctx.request.body;
        const order = await strapi.query('order').findOne({ id });
        order.stock -= quantity;
        await strapi.query('order').update({ id }, order);
        ctx.set('Content-Type', 'application/json');
        ctx.send(order);
    }
};
