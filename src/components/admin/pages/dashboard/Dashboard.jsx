
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
  import { getAllProductApi } from "../../../../axios/product";


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
    const [totalProductsInMonth, setTotalProductsInMonth] = useState(0); // State cho tổng số sản phẩm
    const [totalProducts, setTotalProducts] = useState(0); // State cho tổng số sản phẩm
    const [totalRevenue, setTotalRevenue] = useState(0); // State cho tổng doanh thu
    const [currentPage, setCurrentPage] = useState(0);
    const [productsPerPage] = useState(5);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Lấy token từ localStorage
        if (!token) {
          console.error("No auth token found");
          return;
        }
        const products = await getAllProductApi(token); // Gọi API để lấy dữ liệu sản phẩm
        
        const totalQuantity = products.reduce((total, product) => {
          return total + (product.quantity-product.b_quantity || 0); // Giả sử 'stock' là số lượng của sản phẩm
        }, 0);

        setTotalProducts(totalQuantity);
        setAllProducts(products); // Cập nhật state với dữ liệu nhận được
      } catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken')
        console.log(token);
        // Gửi yêu cầu API với token trong header Authorization
        const response = await axios.get("https://ecommercebe.southeastasia.cloudapp.azure.com/admin/orders/current-month", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(response.data);

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
          setTotalProductsInMonth(totalProductsCount);
          setTotalRevenue(totalRevenueCount);
          console.log()
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



    const sortedProducts = allProducts.slice().sort((a, b) => b.b_quantity - a.b_quantity);
    const offset = currentPage * productsPerPage;
    const currentPageProducts = sortedProducts.slice(
      offset,
      offset + productsPerPage
    );

    const handlePageChange = ({ selected }) => {
      setCurrentPage(selected);
    };

    // **Dữ liệu cho Pie Chart**
    // const categoryCounts = allProducts.reduce((acc, product) => {
    //   acc[product.category] = (acc[product.category] || 0) + 1;
    //   return acc;
    // }, {});

    // const pieChartData = {
    //   labels: Object.keys(categoryCounts), // Danh mục sản phẩm
    //   datasets: [
    //     {
    //       data: Object.values(categoryCounts), // Số lượng sản phẩm theo danh mục
    //       backgroundColor: [
    //         "#FF6384", // Màu 1
    //         "#36A2EB", // Màu 2
    //         "#FFCE56", // Màu 3
    //         "#4CAF50", // Màu 4
    //         "#9C27B0", // Màu 5
    //       ],
    //       hoverBackgroundColor: [
    //         "#FF6384",
    //         "#36A2EB",
    //         "#FFCE56",
    //         "#4CAF50",
    //         "#9C27B0",
    //       ],
    //     },
    //   ],
    // };

    return (
      <>
        <div className={styles.dashboard}>
          {/* Thống kê */}
          <div className={styles.dashboard1}>
            <div className={styles.stat}>
              <p className={styles.stat__title}>Doanh số </p>
              <p className={styles.stat__number}>{totalProductsInMonth}</p>
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
              <p className={styles.stat__number}>{totalProductsInMonth} </p>
              <p className={styles.stat__time}>Tháng trước</p>
              <img src={CartIcon} className={styles.icon} />

            </div>
            <div className={styles.stat}>
              <p className={styles.stat__title}>Sản phẩm </p>
              <p className={styles.stat__number}>{totalProducts}</p>
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
                              <img src={product.image_1} alt="" />
                            </Link>
                          </td>
                          <td data-label="Sản phẩm">
                            <Link to={`/admin/products/${product.id}`}>
                              <strong>{product.name}</strong>
                              <br />
                              <span>{product.price}</span>
                              <br />
                              <span>Danh mục: {product.category.name}</span>
                            </Link>
                          </td>
                          <td data-label="Đã bán">{product.b_quantity}</td>
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

            {/* <div className={styles.chartContainer}>
              <h3>Phân loại sản phẩm</h3>
              <Pie data={pieChartData} />
            </div> */}
          </div>
        </div>
      </>
    );
  }

  export default Dashboard;
