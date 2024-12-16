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
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {orders.length === 0 ? (
          <p className='text-gray-500 text-center'>No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div
              key={order.id}
              className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'
            >
              <div className='flex items-start gap-6 text-sm'>
                <img
                  className='w-16 sm:w-20'
                  src={
                    order.orderItems[0]?.product?.image_1 || 
                    'https://via.placeholder.com/150' // Hình ảnh mặc định nếu không có
                  }
                  alt={order.orderItems[0]?.product?.name || 'Product'}
                />
                <div>
                  <p className='sm:text-base font-medium'>
                    {order.orderItems[0]?.product?.name || 'Product Name'}
                  </p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p className='text-lg'>
                      {currency}
                      {order.totalAmount}
                    </p>
                    <p>Quantity: {order.orderItems[0]?.quantity || 1}</p>
                  </div>
                  <p className='mt-2'>
                    Date: <span className='text-gray-400'>{order.orderDate}</span>
                  </p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{order.statusDescription}</p>
                </div>
                {/* <button className='border px-4 py-2 text-sm font-medium rounded-sm'>
                  Track Order
                </button> */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;