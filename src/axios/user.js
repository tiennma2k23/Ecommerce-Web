import axios from 'axios';

async function getAllUserApi(authToken) {
    const url = "http://192.168.10.101:9999/admin/users/get"; // Đường dẫn API
    const token = authToken; 

    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
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

export { getAllUserApi };