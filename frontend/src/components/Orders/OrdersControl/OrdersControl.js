import React, { Fragment } from "react";

const OrdersControl = (props) => {
  return (
    <Fragment>
      <div className="text-center">
        <button
          className={`btn mr-1 ${props.activeOutputType === 'list' ? 'active':''}`}
          onClick={() => props.onChange('list')}
        >
          List
        </button>
        <button
          className={`btn ${props.activeOutputType === 'chart' ? 'active':''}`}
          onClick={() => props.onChange('chart')}
        >
          Chart
        </button>
      </div>
    </Fragment>
  );
};

export default OrdersControl;
