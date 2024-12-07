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

// async function LogoutApi(authToken) {
//     try {
//         const config = {
//             method: 'post',
//             url: 'https://ecommercebe.southeastasia.cloudapp.azure.com/auth/logout',
//             headers: {
//                 'Authorization': `Bearer ${authToken}` // Đảm bảo có tiền tố Bearer
//             }
//         };

//         const response = await axios.request(config);
//         return response.data;
//     } catch (error) {
//         console.error('Error during logout:', error.response ? error.response.data : error.message);
//         throw error;
//     }
// }  

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

async function GetCartApi(cartId) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Token not found. Please log in again.');
        }

        // Gửi yêu cầu GET
        const response = await axios.get(`https://ecommercebe.southeastasia.cloudapp.azure.com/cart/get`, {
            params: { id: cartId },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Trả về dữ liệu từ API
        return response.data;
    } catch (error) {
        console.error('Error while fetching cart:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function GetProductApi() {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('authToken');

        // if (!token) {
        //     throw new Error('Token not found. Please log in again.');
        // }

        // Gửi yêu cầu GET
        const response = await axios.get('https://ecommercebe.southeastasia.cloudapp.azure.com/user/products/all', {
        });

        // Trả về dữ liệu từ API
        return response.data;
    } catch (error) {
        console.error('Error while fetching products:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function AddProductToCartApi(cartId, productId, quantity)
{
    try {
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Token not found. Please log in again.');
        }

        const url = `https://ecommercebe.southeastasia.cloudapp.azure.com/cart/add/items?cartId=${cartId}&productId=${productId}&quantity=${quantity}`;

        const response = await axios.post(url, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('Error while adding product to cart:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function CheckOutCartApi(userId, cartId, address) {
    try {
        // Token từ localStorage hoặc thay thế bằng giá trị cố định (nếu cần)
        const token = localStorage.getItem('authToken'); // Thay bằng token thực tế

        // URL endpoint
        const url = `https://ecommercebe.southeastasia.cloudapp.azure.com/orders/checkout?userId=${userId}&cartId=${cartId}`;

        // Body chứa thông tin địa chỉ
        const body = {
            doorNumber: address.doorNumber,
            street: address.street,
            city: address.city,
            district: address.district,
        };

        // Gửi yêu cầu POST
        const response = await axios.post(url, body, {
            headers: {
                'Authorization': `Bearer ${token}`, // Thêm Bearer token
                'Content-Type': 'application/json', // Đảm bảo đúng định dạng JSON
            },
        });

        // Trả về kết quả
        return response.data;
    } catch (error) {
        console.error('Error while checking out cart:', error.response ? error.response.data : error.message);
        throw error; // Ném lỗi để xử lý bên ngoài nếu cần
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

export { CreateAccountApi, LoginApi, LogoutApi, CreateCartApi, GetCartApi, AddProductToCartApi, CheckOutCartApi, GetProductApi, CheckTokenApi };
