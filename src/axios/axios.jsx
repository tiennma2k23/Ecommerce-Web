import axios from 'axios';


async function CreateAccountApi(firstName, lastName, email, password) {
    console.log(firstName);
    console.log(lastName);
    console.log(email);
    console.log(password);
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
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error:', error.message);
        } else if (error.response) {
            console.error('Server error:', error.response.data);
        } else {
            console.error('Unexpected error:', error.message);
        }
        throw error;
    }
}

async function LogoutApi(authToken) {
    try {
        const config = {
            method: 'post',
            url: 'https://ecommercebe.southeastasia.cloudapp.azure.com/auth/logout',
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

async function LogoutApi(token) {
    try {
        const response = await axios.post(
            'http://192.168.10.101:9999/auth/logout',
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

export { CreateAccountApi, LoginApi, LogoutApi };
