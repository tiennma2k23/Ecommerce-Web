import React from 'react';

const OrderDetails = ({ orderId }) => {
  return (
    <div className="order-details">
      <div>Đơn hàng {orderId}</div>
      <div className="actions">
        <button className="add-product">Thêm sản phẩm</button>
        <button className="qr-code">QR Code sản phẩm</button>
      </div>
      <div className="cart">
        <p>Giỏ hàng trống.</p>
      </div>

    </div>
  );
};

export default OrderDetails;
