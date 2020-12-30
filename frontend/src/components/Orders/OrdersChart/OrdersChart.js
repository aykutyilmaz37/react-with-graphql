import React, { Fragment } from "react";
import { Bar } from "react-chartjs-2";
import '../../../assets/scss/Charts.scss';

const ORDERS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 101,
    max: 500,
  },
  Expensive: {
    min: 501,
    max: 100000000000,
  },
};

const OrdersChart = (props) => {
  const chartData = { labels: [], datasets: [] };
  let values = [];

  for (const bucket in ORDERS_BUCKETS) {
    const filteredOrdersCount = props.orders.reduce((prev, current) => {
      if (
        current.event.price > ORDERS_BUCKETS[bucket].min &&
        current.event.price < ORDERS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredOrdersCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      label: bucket,
      data: values,
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }
  return (
    <Fragment>
      <div className="charts">
        <Bar
          data={chartData}
          width={500}
          height={500}
          options={{ maintainAspectRatio: false }}
        />
      </div>
    </Fragment>
  );
};
export default OrdersChart;
