import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { ShopContext } from '../context/ShopContext';
import { CreateAccountApi, LoginApi } from '../axios/axios';

const Login = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, handleAuthentication } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState('Login');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  
    if (currentState === 'Sign Up') {
        try {

            const response = await CreateAccountApi(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.password,
                formData.phoneNumber
            );
            console.log(response);
            if (response === "Verify you email") {
                alert('Tạo tài khoản thành công. Vui lòng xác minh email của bạn.');
                setCurrentState('Login'); // Chuyển sang trạng thái đăng nhập
                navigate("/login");
            } else {
                throw new Error('Tạo tài khoản thất bại');
            }
        } catch (error) {
            // alert('Failed to create account. Please try again.');
            console.error(error);
        }
    } else {
        try {
            const response = await LoginApi(formData.email, formData.password);
            if (response && response.token) {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userName', response.name);
                localStorage.setItem('userId', response.userId);
                localStorage.setItem('userEmail', response.email);
                localStorage.setItem('userName', response.name);
                localStorage.setItem('userRole', response.role);
                localStorage.setItem('defaultCartId', response.defaultCartId);
                localStorage.setItem('role', response.role);
                handleAuthentication(true); // Cập nhật trạng thái đăng nhập
                if(response.role == "USER") {
                  navigate("/"); // Chuyển hướng về trang chủ
                } else if (response.role == "ADMIN") {
                  navigate("/admin")
                }
            } else {
                alert('Đăng nhập thật bại. Vui lòng xác thực tài khoản.');
            }
        } catch (error) {
            alert('ăng nhập thật bại. Vui lòng thử lại.');
            console.error(error);
        }
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
      <p className="prata-regular text-3xl">
        {currentState === "Sign Up" ? "Đăng ký" : "Đăng nhập"}
      </p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === 'Sign Up' && (
        <>
          <input
            type="text"
            name="firstName"
            className="font-sans w-full px-3 py-2 border border-gray-800"
            placeholder="Họ"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="lastName"
            className="font-sans w-full px-3 py-2 border border-gray-800"
            placeholder="Tên"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            className="font-sans w-full px-3 py-2 border border-gray-800"
            placeholder="Số điện thoại"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </>
      )}
      <input
        type="email"
        name="email"
        className="font-sans w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password"
        className="font-sans w-full px-3 py-2 border border-gray-800"
        placeholder="Mật khẩu"
        value={formData.password}
        onChange={handleInputChange}
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        {/* <p className="cursor-pointer">Forgot your password?</p> */}
        <p
          onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
          className="cursor-pointer"
        >
          {currentState === 'Login' ? 'Tạo tài khoản' : 'Đăng nhập'}
        </p>
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === 'Login' ? 'Đăng nhập' : 'Đăng ký'}
      </button>
    </form>
  );
};

export default Login;