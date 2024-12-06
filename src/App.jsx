// import React, { useContext } from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { ShopContext } from '../src/context/ShopContext';
// import Home from './pages/Home';
// import Collection from './pages/Collection';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Product from './pages/Product';
// import Cart from './pages/Cart';
// import Login from './pages/Login';
// import PlaceOrder from './pages/PlaceOrder';
// import Orders from "./pages/Orders";
// import UserLayout from './pages/userLayout'; 
// import LayoutDefault from "./components/admin/layouts/LayoutDefault";

// const App = () => {
//   const { isAuthenticated } = useContext(ShopContext);
//   const location = useLocation();
//   const isAdminRoute = location?.pathname?.startsWith("/admin");
//   const isAdmin = localStorage.getItem('role') === 'ADMIN';

//   const ProtectedRoute = ({ children }) => {
//     return isAuthenticated ? children : <Navigate to="/login" />;
//   };

//   return (
//     <Routes>
//       {/* Admin Route - LayoutDefault for Admin */}
//       {isAdminRoute && isAdmin && (
//         <Route path="/admin/*" element={<LayoutDefault />} />
//       )}

//       {/* User Routes */}
//       {!isAdminRoute && (
//         <Route path="/" element={<UserLayout><Home /></UserLayout>} />
//       )}
//       <Route path="/collection" element={<UserLayout><Collection /></UserLayout>} />
//       <Route path="/about" element={<UserLayout><About /></UserLayout>} />
//       <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
//       <Route path="/product/:productId" element={<UserLayout><Product /></UserLayout>} />
//       <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />
//       <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
//       <Route path="/place-order" element={<UserLayout><PlaceOrder /></UserLayout>} />
//       <Route
//         path="/orders"
//         element={
//           <ProtectedRoute>
//             <UserLayout><Orders /></UserLayout>
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// };

// export default App;

import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ShopContext } from "./context/ShopContext";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import UserLayout from "./pages/userLayout";
import LayoutDefault from "./components/admin/layouts/LayoutDefault";

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
