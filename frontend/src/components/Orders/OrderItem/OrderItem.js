import React from "react";

const OrderItem = (props) => {
  return (
    <li className="orders__list-item">
      <div>
        <h4>{props.title}</h4>
        <h2>{new Date(props.createdAt).toLocaleString("tr-TR")}</h2>
      </div>
      <div>
        <button className="btn" onClick={() => props.onDelete(props.orderId)}>Cancel</button>
      </div>
    </li>
  );
};

export default OrderItem;
