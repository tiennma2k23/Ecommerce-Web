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
                formData.password
            );
            console.log(response);
            if (response === "Verify you email") {
                alert('Account created successfully! Please verify your email.');
                setCurrentState('Login'); // Chuyển sang trạng thái đăng nhập
                navigate("/login");
            } else {
                throw new Error('Account creation failed');
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
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            alert('Login failed. Please try again.');
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
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === 'Sign Up' && (
        <>
          <input
            type="text"
            name="firstName"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="lastName"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </>
      )}
      <input
        type="email"
        name="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        <p
          onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
          className="cursor-pointer"
        >
          {currentState === 'Login' ? 'Create account' : 'Login Here'}
        </p>
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;