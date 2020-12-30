import React from "react";
import OrderItem from "../OrderItem/OrderItem";

const OrderList = (props) => {
  const orders = props.orders.map((order) => {
    return (
      <OrderItem
        key={order._id}
        orderId={order._id}
        title={order.event.title}
        createdAt={order.createdAt}
        onDelete={props.onDelete}
      />
    );
  });
  return <ul className="orders__list">{orders}</ul>;
};

export default OrderList;
