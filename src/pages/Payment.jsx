import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const Payment = () => {
  const { QRCode } = useContext(ShopContext);

  if (!QRCode || !QRCode.data) {
    return <p>Loading QR Code...</p>; // Hiển thị khi chưa có dữ liệu
  }

  return (
    <div>
      {/* <p>QR Code Data: {QRCode.data.qrCode}</p> */}

      {/* Hiển thị hình ảnh QR Code nếu có */}
      {QRCode.data.qrDataURL && (
        <img
          src={QRCode.data.qrDataURL}
          alt="QR Code"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
    </div>
  );
};

export default Payment;