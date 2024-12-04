
import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Pie } from "react-chartjs-2"; // Import Pie chart từ react-chartjs-2
import CartIcon from '/src/components/admin/components/Assets/dashboard/cart.svg';
import DollarIcon from '/src/components/admin/components/Assets/dashboard/dollar.svg';
import TruckIcon from '/src/components/admin/components/Assets/dashboard/truck.svg';
import SackDollarIcon from '/src/components/admin/components/Assets/dashboard/sackDollar.svg';


import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [allProducts, setAllProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0); // State cho tổng số sản phẩm
  const [totalRevenue, setTotalRevenue] = useState(0); // State cho tổng doanh thu
  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage] = useState(5);

  const fetchData = async () => {
    await axios
      .get("https://dummyjson.com/products")
      .then((res) => {
        if (res.status === 200) setAllProducts(res.data.products);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('authToken')
      // Gửi yêu cầu API với token trong header Authorization
      const response = await axios.get("http://192.168.10.101:9999/admin/orders/current-month", {
        headers: {
          Authorization: {token} // Cung cấp token ở đây
        }
      });

      console.log(response.status)
      
      if (response.status === 200) {
        const orders = response.data; // Dữ liệu trả về từ API
        let totalProductsCount = 0;
        let totalRevenueCount = 0;

        // Lặp qua từng đơn hàng
        orders.forEach((order) => {
          order.orderItems.forEach((item) => {
            totalProductsCount += item.quantity; // Đếm số lượng sản phẩm
            totalRevenueCount += item.quantity * item.product.price; // Tính doanh thu
          });
        });

        // Cập nhật giá trị trong state
        setTotalProducts(totalProductsCount);
        setTotalRevenue(totalRevenueCount);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchOrders();
  }, []);



  const sortedProducts = allProducts.slice().sort((a, b) => b.stock - a.stock);
  const offset = currentPage * productsPerPage;
  const currentPageProducts = sortedProducts.slice(
    offset,
    offset + productsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // **Dữ liệu cho Pie Chart**
  const categoryCounts = allProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(categoryCounts), // Danh mục sản phẩm
    datasets: [
      {
        data: Object.values(categoryCounts), // Số lượng sản phẩm theo danh mục
        backgroundColor: [
          "#FF6384", // Màu 1
          "#36A2EB", // Màu 2
          "#FFCE56", // Màu 3
          "#4CAF50", // Màu 4
          "#9C27B0", // Màu 5
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#9C27B0",
        ],
      },
    ],
  };

  return (
    <>
      <div className={styles.dashboard}>
        {/* Thống kê */}
        <div className={styles.dashboard1}>
          <div className={styles.stat}>
            <p className={styles.stat__title}>Doanh số </p>
            <p className={styles.stat__number}>{totalProducts}</p>
            <p className={styles.stat__time}>Tháng này</p>
            <img src={SackDollarIcon} className={styles.icon} />
          </div>
          <div className={styles.stat}>
            <p className={styles.stat__title}>Doanh số</p>
            <p className={styles.stat__number}>1</p>
            <p className={styles.stat__time}>Hôm nay</p>
            <img src={DollarIcon} className={styles.icon} />

          </div>
          <div className={styles.stat}>
            <p className={styles.stat__title}>Sản phẩm </p>
            <p className={styles.stat__number}>{totalProducts} </p>
            <p className={styles.stat__time}>Tháng trước</p>
            <img src={CartIcon} className={styles.icon} />

          </div>
          <div className={styles.stat}>
            <p className={styles.stat__title}>Sản phẩm </p>
            <p className={styles.stat__number}>500</p>
            <p className={styles.stat__time}>Trong kho</p>
            <img src={TruckIcon} className={styles.icon} />
            

            </div>
        </div>

        <div className={styles.table}>
          {/* Bảng sản phẩm */}
          <div className={styles.right__table}>
            <p className={styles.right__tableTitle}>Top sản phẩm bán chạy</p>
            <div className={styles.right__tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Hình ảnh</th>
                    <th>Sản phẩm</th>
                    <th>Đã bán</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageProducts.map((product, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="STT">{index + 1 + offset}</td>
                        <td data-label="Hình ảnh">
                          <Link to={`/admin/products/${product.id}`}>
                            <img src={product.thumbnail} alt="" />
                          </Link>
                        </td>
                        <td data-label="Sản phẩm">
                          <Link to={`/admin/products/${product.id}`}>
                            <strong>{product.title}</strong>
                            <br />
                            <span>{product.price}</span>
                            <br />
                            <span>Thương hiệu: {product.brand}</span>
                            <br />
                            <span>Danh mục: {product.category}</span>
                          </Link>
                        </td>
                        <td data-label="Đã bán">{product.stock}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ReactPaginate
              previousLabel={"Trước"}
              nextLabel={"Tiếp"}
              breakLabel={"..."}
              pageCount={Math.ceil(sortedProducts.length / productsPerPage)}
              onPageChange={handlePageChange}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
            />
          </div>

          <div className={styles.chartContainer}>
            <h3>Phân loại sản phẩm</h3>
            <Pie data={pieChartData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
