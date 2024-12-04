import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Breadcrumbs.css'; 

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const [productName, setProductName] = useState('');

  const breadcrumbMap = {
    admin: 'Quản trị viên',
    dashboard: 'Tổng quan',
    products: 'Sản phẩm',
    order: 'Quản lý đơn hàng',
    "product-management": 'Quản lý sản phẩm',
    "user-management": 'Quản lý tài khoản',
    setting: 'Cài đặt',

  };

  useEffect(() => {
    const productId = pathnames[pathnames.length - 1];
    if (pathnames.includes('products') && !isNaN(productId)) {
      axios.get(`https://dummyjson.com/products/${productId}`)
        .then((response) => {
          if (response.status === 200) {
            setProductName(response.data.title);
          }
        })
        .catch((error) => console.error('Error fetching product data:', error));
    } else {
      setProductName('');
    }
  }, [pathnames]);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <li
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              key={to}
              aria-current="page"
            >
              {productName || breadcrumbMap[value] || value}
            </li>
          ) : (
            <li className="breadcrumb-item" key={to}>
              <NavLink 
                to={to}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {breadcrumbMap[value] || value}
              </NavLink>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
