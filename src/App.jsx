import React, {useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import ProductManagement from './components/admin/productManagament/productManagement';
import ProductCreate from './components/admin/productManagament/productCreate';
import ProductEdit from './components/admin/productManagament/productEdit';

const App = () => {
  const { isAuthenticated, handleAuthentication } = useContext(ShopContext); 

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <SearchBar /> 
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/collection' element={<Collection/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/product/:productId' element={<Product/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/login' element={<Login setIsAuthenticated={handleAuthentication}/>} />
        <Route path='/place-order' element={<PlaceOrder/>} />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path='/admin/user-management' element={<UserManagement/>} />
        <Route path='/admin/product-management' element={<ProductManagement/>} />
        <Route path='/admin/product-management/product-create' element={<ProductCreate/>} />
        <Route path='/admin/product-management/product-edit' element={<ProductEdit/>} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
