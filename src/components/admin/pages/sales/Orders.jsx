
import React, { useState } from 'react';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import './Orders.css';

const OrderManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Dummy data cho đơn hàng
  const orders = [
    'HD15030034',
    'HD15030032',
    'HD15030028',
    'HD15030012',
    'HD15030006',
  ];

  return (
    <div className="order-management">
      <h1>Quản lý đơn hàng</h1>
      <div className="tabs">
        <button className="tab active">Tạo mới</button>
        <button className="tab">Danh sách hóa đơn</button>
      </div>
      <div className="content">
        <OrderList orders={orders} onSelectOrder={setSelectedOrder} />
        {selectedOrder ? (
          <OrderDetails orderId={selectedOrder} />
        ) : (
          <p>Vui lòng chọn đơn hàng để xem chi tiết.</p>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
