import React from 'react';
import axios from 'axios';

async function CreateAccountApi(firstName, lastName, email, password) {
    // Prepare the data to be sent in JSON format
    const requestData = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
    };

    try {
        // Make the POST request to the server API
        const response = await axios.post(
            'https://ecommercebe.southeastasia.cloudapp.azure.com/auth/sign-up',
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 200) {
            console.log('Account created successfully:', response.data);
            return response.data; // Return the response data from the API
        } else {
            throw new Error(`Failed to create account. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error creating account:', error.message || error);
        throw error; // Rethrow the error to be handled by the calling code
    }
}

async function LoginApi(email, password) {
    try {
        const response = await axios.post('https://ecommercebe.southeastasia.cloudapp.azure.com/auth/sign-in', {
            email: email,
            password: password
        });

        return response.data;
    } catch (error) {
        // Xử lý lỗi
        console.error('Error during login:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function LogoutApi(token) {
    try {
        const response = await axios.post(
            'https://ecommercebe.southeastasia.cloudapp.azure.com/auth/logout',
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error during logout:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function CreateCartApi(userId) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        const response = await axios.post(
            `https://ecommercebe.southeastasia.cloudapp.azure.com/cart/create`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    user_id: userId,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error during CreateCartApi: ', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function CheckTokenApi() {
    try {
        const token = localStorage.getItem("authToken");

        // Kiểm tra trạng thái fulfilled của token
        if (token) {
            return true; // Token hợp lệ (fulfilled với true)
        }
        return false; // Token không hợp lệ
    } catch (error) {
        console.error("Error while checking token:", error.message);
        return false;
    }
}

export { CreateAccountApi, LoginApi, LogoutApi, CreateCartApi, CheckTokenApi };
