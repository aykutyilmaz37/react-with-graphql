import React, { Fragment, useState, useEffect, useContext } from "react";
import "../assets/scss/Orders.scss";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import OrderList from "../components/Orders/OrderList/OrderList";
import OrdersChart from "../components/Orders/OrdersChart/OrdersChart";
import OrdersControl from "../components/Orders/OrdersControl/OrdersControl";
import { toast } from 'react-toastify';

const Orders = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [outputType, setOutputType] = useState("list");
  const context = useContext(AuthContext);
  const token = context.token;
  const  GRAPHQL_URL = '/graphql';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    const requestBody = {
      query: `
          query{
            orders{
              _id
             createdAt
             event{
               _id
               title
               date
               price
             }
            }
          }
        `,
    };

    fetch(GRAPHQL_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        const orders = resData.data.orders;
        setOrders(orders);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.message)
      });
  };

  const deleteOrderHandler = (orderId) => {
    setLoading(true);
    const requestBody = {
      query: `
        mutation CancelOrder($id:ID!) {
          cancelOrder(orderId: $id) {
            _id
            title
          }
        }      
        `,
      variables: {
        id: orderId,
      },
    };

    fetch(GRAPHQL_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        const data = orders.filter((order) => {
          return order._id !== orderId;
        });
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.message)
      });
  };

  const changeOutputTypeHandler = (outputType) => {
    if (outputType === "list") {
      setOutputType("list");
    } else {
      setOutputType("chart");
    }
  };

  let content = <Spinner />;
  if (!loading) {
    content = (
      <Fragment>
        <OrdersControl
          activeOutputType={outputType}
          onChange={changeOutputTypeHandler}
        />
        <div>
          {outputType === "list" ? (
            <OrderList orders={orders} onDelete={deleteOrderHandler} />
          ) : (
            <OrdersChart orders={orders} />
          )}
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="orders">
        <h1 className="text-center">Orders Page</h1>
        {content}
      </div>
    </Fragment>
  );
};

export default Orders;
