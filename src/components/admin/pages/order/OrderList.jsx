import React from 'react';

const OrderList = ({ orders, onSelectOrder }) => {
  return (
    <div className="order-list">
      {orders.map((order) => (
        <button key={order} onClick={() => onSelectOrder(order)} className="order-item">
          {order}
        </button>
      ))}
    </div>
  );
};

export default OrderList;
