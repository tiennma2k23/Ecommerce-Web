import axios from 'axios';

async function getAllCategoryApi(authToken) {
    const baseUrl = 'https://ecommercebe.southeastasia.cloudapp.azure.com'

    const url = `${baseUrl}/admin/category/all`; // Đường dẫn API
    const token = authToken; 

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error response status:", error.response?.status);
        console.error("Error response data:", error.response?.data || error.message);
        throw error;
    }
    
}

export { 
    getAllCategoryApi
};