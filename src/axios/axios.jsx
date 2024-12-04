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
            'http://13.76.169.48:9999/auth/sign-up',
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
        const response = await axios.post('http://13.76.169.48:9999/auth/sign-in', {
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

async function LogoutApi(authToken) {
    try {
        const config = {
            method: 'post',
            url: 'http://13.76.169.48:9999/auth/logout',
            headers: {
                'Authorization': `Bearer ${authToken}` // Đảm bảo có tiền tố Bearer
            }
        };

        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error('Error during logout:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export { 
    CreateAccountApi, 
    LoginApi,
    LogoutApi 
};
