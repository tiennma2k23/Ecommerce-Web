import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import { GetAllOrderApi } from '../axios/order';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const currency = "đ"; // Đơn vị tiền tệ

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await GetAllOrderApi(); // Gọi API để lấy danh sách order
        console.log(data);
        setOrders(data); // Cập nhật state với dữ liệu trả về từ API
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchOrders();
  }, []); // Gọi 1 lần khi component được render

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="py-4 border-t border-b text-gray-700 flex flex-col gap-4"
            >
              <div>
                <p className="text-lg font-medium">Order ID: {order.id}</p>
                <p className="text-gray-500">
                  Date: <span className="text-gray-400">{order.orderDate}</span>
                </p>
                <p className="text-gray-500">
                  Status: <span>{order.statusDescription}</span>
                </p>
              </div>

              {/* Duyệt qua tất cả các sản phẩm trong orderItems */}
              <div className="flex flex-col gap-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-6 text-sm">
                    <img
                      className="w-16 sm:w-20"
                      src={
                        item.product?.image_1 || 
                        "https://via.placeholder.com/150" // Hình ảnh mặc định nếu không có
                      }
                      alt={item.product?.name || "Product"}
                    />
                    <div>
                      <p className="sm:text-base font-medium">
                        {item.product?.name || "Product Name"}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                        <p className="text-lg">
                          {currency}
                          {item.orderedProductPrice}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-semibold">
                  Total: {currency}{order.totalAmount}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;