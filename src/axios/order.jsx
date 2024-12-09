import axios from 'axios';

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

        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error while adding product to cart:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function updateQuantityItem(cartId, itemId, quantity) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Token not found. Please log in again.');
        }

        // Gửi yêu cầu PUT với query parameters
        const response = await axios.put(
            `https://ecommercebe.southeastasia.cloudapp.azure.com/cart/update/item/quantity`, 
            null, // No body content required for PUT request
            {
                params: {
                    cartId: cartId,    // Cart ID
                    itemId: itemId,    // Item ID
                    quantity: quantity // New quantity
                },
                headers: {
                    Authorization: `Bearer ${token}` // Authorization header with the token
                }
            }
        );

        // Trả về dữ liệu từ API
        return response.data;
    } catch (error) {
        console.error('Error while updating cart:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function removeItem(cartId, itemId) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Token not found. Please log in again.');
        }

        // Gửi yêu cầu DELETE
        const response = await axios.delete(
            `https://ecommercebe.southeastasia.cloudapp.azure.com/cart/remove/items`, 
            {
                params: {
                    cartId: cartId,    // Query Parameter: Cart ID
                    itemId: itemId,    // Query Parameter: Item ID
                },
                headers: {
                    Authorization: `Bearer ${token}` // Gửi token trong Authorization Header
                }
            }
        );

        // Trả về dữ liệu từ API
        return response.data;
    } catch (error) {
        console.error('Error while removing cart item:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function clearCart(cartId) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Token not found. Please log in again.');
        }

        // Gửi yêu cầu DELETE
        const response = await axios.delete(
            `https://ecommercebe.southeastasia.cloudapp.azure.com/cart/clear`, 
            {
                params: {
                    id: cartId
                },
                headers: {
                    Authorization: `Bearer ${token}` // Gửi token trong Authorization Header
                }
            }
        );

        // Trả về dữ liệu từ API
        return response.data;
    } catch (error) {
        console.error('Error while removing cart item:', error.response ? error.response.data : error.message);
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

export { 
    CreateCartApi, 
    GetCartApi, 
    AddProductToCartApi, 
    updateQuantityItem,
    removeItem,
    clearCart,
    CheckOutCartApi, 
};