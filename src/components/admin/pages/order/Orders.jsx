import React, { useState } from 'react';
import SearchIcon from '../../components/Assets/dashboard/search.svg';
import './Orders.css';

const Order = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const orders = [
    { id: '6286437', date: '24/10/2019', customer: 'Hana Wharton', status: 'Khởi tạo', items: 2, total: 87.99, paymentMethod: 'Credit Payments' },
    { id: '6286421', date: '24/10/2019', customer: 'Liya Milne', status: 'Đang giao', items: 1, total: 12.99, paymentMethod: 'Manual Payment' },
    { id: '6286414', date: '24/10/2019', customer: 'Tamsin Bloom', status: 'Đã thanh toán', items: 1, total: 201.49, paymentMethod: 'Credit Payments' },
    { id: '6286385', date: '24/10/2019', customer: 'Coby Beil', status: 'Hoàn thành', items: 1, total: 502.99, paymentMethod: 'Credit Payments' },
    { id: '6286378', date: '24/10/2019', customer: 'Nathaniel Humphreys', status: 'Đã hủy', items: 1, total: 102.99, paymentMethod: 'Credit Payments' },
  ];

  // Đếm số đơn hàng theo trạng thái
  const countOrders = (status) => {
    switch (status) {
      case 'Khởi tạo':
        return orders.filter(order => order.status.includes('Khởi tạo')).length;
      case 'Đang giao':
        return orders.filter(order => order.status.startsWith('Đang giao')).length;
      case 'Đã thanh toán':
        return orders.filter(order => order.status.startsWith('Đã thanh toán')).length;
      case 'Hoàn thành':
        return orders.filter(order => order.status === 'Hoàn thành').length;
      case 'Đã hủy':
        return orders.filter(order => order.status === 'Đã hủy').length;
      case 'Tất cả':
      default:
        return orders.length;
    }
  };

  // Lọc đơn hàng theo trạng thái và tìm kiếm
  const filterOrders = (status) => {
    let filteredOrders = orders;
    
    // Lọc theo trạng thái
    if (status === 'Tất cả') filteredOrders = orders;
    if (status === 'Khởi tạo') filteredOrders = orders.filter(order => order.status.includes('Khởi tạo'));
    if (status === 'Đang giao') filteredOrders = orders.filter(order => order.status.includes('Đang giao'));
    if (status === 'Đã thanh toán') filteredOrders = orders.filter(order => order.status.startsWith('Đã thanh toán'));
    if (status === 'Hoàn thành') filteredOrders = orders.filter(order => order.status === 'Hoàn thành');
    if (status === 'Đã hủy') filteredOrders = orders.filter(order => order.status === 'Đã hủy');

    // Lọc theo từ khóa tìm kiếm
    if (search) {
      filteredOrders = filteredOrders.filter((order) =>
        Object.values(order).some((value) =>
          value.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    return filteredOrders;
  };

  // Lấy lớp CSS cho trạng thái
  const getStatusClass = (status) => {
    if (status === 'Khởi tạo') return 'status-green';
    if (status === 'Đã hủy') return 'status-red';
    if (status.includes('Đang giao')) return 'status-blue';
    if (status.includes('Đã thanh toán')) return 'status-blue';
    if (status.includes('Hoàn thành')) return 'status-yellow';
    return '';
  };

  return (
    <div className="order-container">
      {/* Tabs */}
      <div className="order-tabs">
        {['Tất cả', 'Khởi tạo', 'Đang giao', 'Đã thanh toán', 'Hoàn thành', 'Đã hủy'].map((tab) => (
          <button
            key={tab}
            className={`order-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span>{countOrders(tab)}</span>
          </button>
        ))}
      </div>

      {/* Tìm kiếm */}
      <div className="order-search">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, mã ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn">
          <img src={SearchIcon} alt="" />
        </button>
      </div>

      {/* Bảng đơn hàng */}
      <table className="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ngày giờ</th>
            <th>Khách hàng</th>
            <th>Trạng thái</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
            <th>Thanh toán</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filterOrders(activeTab).map((order) => (
            <tr key={order.id}>
              <td>
                <a href="#">{`#${order.id}`}</a>
              </td>
              <td>{order.date}</td>
              <td>{order.customer}</td>
              <td>
                <span className={`status ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td>{order.items}</td>
              <td>£{order.total.toFixed(2)}</td>
              <td>{order.paymentMethod}</td>
              <td>
                <button className="action-btn" >Xem</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Order;
