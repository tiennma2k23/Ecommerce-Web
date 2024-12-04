import React, { useState } from 'react';
import SearchIcon from '../../components/Assets/dashboard/search.svg';
import './Orders.css';

const Order = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const orders = [
    { id: '6286437', date: '24/10/2019', customer: 'Hana Wharton', status: 'Processing - Packaging', items: 2, total: 87.99, paymentMethod: 'Credit Payments' },
    { id: '6286421', date: '24/10/2019', customer: 'Liya Milne', status: 'Dispatched', items: 1, total: 12.99, paymentMethod: 'Manual Payment' },
    { id: '6286414', date: '24/10/2019', customer: 'Tamsin Bloom', status: 'Processing - Waiting Dispatch', items: 1, total: 201.49, paymentMethod: 'Credit Payments' },
    { id: '6286385', date: '24/10/2019', customer: 'Coby Beil', status: 'Cancelled', items: 1, total: 502.99, paymentMethod: 'Credit Payments' },
    { id: '6286378', date: '24/10/2019', customer: 'Nathaniel Humphreys', status: 'Dispatched', items: 1, total: 102.99, paymentMethod: 'Credit Payments' },
  ];

  // Đếm số đơn hàng theo trạng thái
  const countOrders = (status) => {
    switch (status) {
      case 'Pending':
        return orders.filter(order => order.status.includes('Processing')).length;
      case 'Processing':
        return orders.filter(order => order.status.startsWith('Processing')).length;
      case 'Complete':
        return orders.filter(order => order.status === 'Dispatched').length;
      case 'Cancelled':
        return orders.filter(order => order.status === 'Cancelled').length;
      case 'All':
      default:
        return orders.length;
    }
  };

  // Lọc đơn hàng theo trạng thái và tìm kiếm
  const filterOrders = (status) => {
    let filteredOrders = orders;
    
    // Lọc theo trạng thái
    if (status === 'All') filteredOrders = orders;
    if (status === 'Pending') filteredOrders = orders.filter(order => order.status.includes('Processing'));
    if (status === 'Processing') filteredOrders = orders.filter(order => order.status.startsWith('Processing'));
    if (status === 'Complete') filteredOrders = orders.filter(order => order.status === 'Dispatched');
    if (status === 'Cancelled') filteredOrders = orders.filter(order => order.status === 'Cancelled');

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
    if (status === 'Dispatched') return 'status-green';
    if (status === 'Cancelled') return 'status-red';
    if (status.includes('Processing')) return 'status-blue';
    return '';
  };

  return (
    <div className="order-container">
      {/* Tabs */}
      <div className="order-tabs">
        {['All', 'Pending', 'Processing', 'Complete', 'Cancelled'].map((tab) => (
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
