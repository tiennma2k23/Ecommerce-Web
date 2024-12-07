import React, {useContext, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../src/context/ShopContext';
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserManagement from './components/admin/userManagement/userManagement';
import { CheckTokenApi } from './axios/axios';
import UserLayout from "./pages/userLayout";
import LayoutDefault from './components/admin/layouts/LayoutDefault';

// const App = () => {
//   const { isAuthenticated, setIsAuthenticated } = useContext(ShopContext);

//   useEffect(() => {
//     const checkToken = async () => {
//         const isLoggedIn = await CheckTokenApi();
//         setIsAuthenticated(isLoggedIn);
//     };

//     checkToken();
//   }, []);

//   console.log(isAuthenticated);

//   const ProtectedRoute = ({ children }) => {
//     return isAuthenticated ? children : <Navigate to="/login"/>;
//   };

//   return (
//     <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
//       <ToastContainer />
//       <Navbar />
//       <SearchBar /> 
//       <Routes>
//         <Route path='/' element={<Home/>} />
//         <Route path='/collection' element={<Collection/>} />
//         <Route path='/about' element={<About/>} />
//         <Route path='/contact' element={<Contact/>} />
//         <Route path='/product/:productId' element={<Product/>} />
//         <Route path='/cart' element={<Cart/>} />
//         <Route path='/login' element={<Login/>} />
//         <Route path='/place-order' element={<PlaceOrder/>} />
//         <Route
//           path="/orders"
//           element={
//             <ProtectedRoute>
//               <Orders />
//             </ProtectedRoute>
//           }
//         />
//         <Route path='/admin/user-management' element={<UserManagement/>} />
//       </Routes>
//       <Footer/>
//     </div>
//   )
// }

const App = () => {
  const { isAuthenticated } = useContext(ShopContext);
  const location = useLocation();
  const isAdminRoute = location?.pathname?.startsWith("/admin");
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  // Admin routes
  if (isAdminRoute) {
    if (!isAdmin) {
      return <Navigate to="/login" />;
    }
    return <LayoutDefault />;
  }

  // User routes
  switch (location.pathname) {
    case "/":
      return <UserLayout><Home /></UserLayout>;
    case "/collection":
      return <UserLayout><Collection /></UserLayout>;
    case "/about":
      return <UserLayout><About /></UserLayout>;
    case "/contact":
      return <UserLayout><Contact /></UserLayout>;
    case `/product/${location.pathname.split("/")[2]}`: // Dynamic route
      return <UserLayout><Product /></UserLayout>;
    case "/cart":
      return <UserLayout><Cart /></UserLayout>;
    case "/login":
      return <UserLayout><Login /></UserLayout>;
    case "/place-order":
      return <UserLayout><PlaceOrder /></UserLayout>;
    case "/orders":
      return isAuthenticated ? (
        <UserLayout><Orders /></UserLayout>
      ) : (
        <Navigate to="/login" />
      );
    default:
      return <Navigate to="/" />;
  }
};

export default App;
