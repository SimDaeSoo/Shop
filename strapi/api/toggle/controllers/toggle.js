module.exports = {
  index: async ctx => {
    const { type, order } = ctx.request.body;
    const { id } = ctx.state.user;
    const user = await strapi.query('user', 'users-permissions').findOne({ id });

    if (type === 'like') {
      const likes = user.liked_orders.map(order => Number(order.id));
      const index = likes.indexOf(Number(order));
      if (index >= 0) {
        user.liked_orders.splice(index, 1);
      } else {
        if (!user.liked_orders) user.liked_orders = [];
        user.liked_orders.push(order);
      }
    } else if (type === 'carry') {
      const carries = user.carried_orders.map(order => Number(order.id));
      const index = carries.indexOf(Number(order));
      if (index >= 0) {
        user.carried_orders.splice(index, 1);
      } else {
        if (!user.carried_orders) user.carried_orders = [];
        user.carried_orders.push(order);
      }
    }

    await strapi.query('user', 'users-permissions').update({ id }, user);
    const refreshedOrder = await strapi.query('order').findOne({ id: order });

    ctx.set('Content-Type', 'application/json');
    ctx.send({ user, order: refreshedOrder });
  }
};
