const Order = require("../../models/order");
const Event = require("../../models/event");
const { transformOrder, transformEvent } = require("./merge");

module.exports = {
  orders: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthentication");
    }
    try {
      const orders = await Order.find({ user: req.userId });
      return orders.map((order) => {
        return transformOrder(order);
      });
    } catch (err) {
      throw err;
    }
  },
  orderEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthentication");
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const order = new Order({
      user: req.userId,
      event: fetchedEvent,
    });
    const res = await order.save();
    return transformOrder(res);
  },
  cancelOrder: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthentication");
    }
    try {
      const order = await Order.findById(args.orderId).populate("event");
      const event = transformEvent(order.event);
      await Order.deleteOne({ _id: args.orderId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
