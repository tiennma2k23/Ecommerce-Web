import axios from 'axios';

async function getAllCategoryApi(authToken) {
    const url = "https://ecommercebe.southeastasia.cloudapp.azure.com/admin/category/all"; // Đường dẫn API
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

// async function createProductApi(name, image_1, price, description, quantity) {
//     const url = "http://192.168.10.101:9999/admin/products/add?categoryId=1"; // Đường dẫn API
//     const token = authToken; // Thay authToken bằng giá trị token hợp lệ

//     try {
//         const response = await axios.post(
//             url,
//             {
//                 name,        // Tên sản phẩm
//                 image_1,     // Hình ảnh sản phẩm
//                 price,       // Giá
//                 description, // Mô tả
//                 quantity     // Số lượng
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`, // Bearer Token
//                     "Content-Type": "application/json" // Định dạng JSON
//                 }
//             }
//         );

//         console.log("Response status:", response.status);
//         console.log("Response headers:", response.headers);
//         console.log("Response data:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("Error response status:", error.response?.status);
//         console.error("Error response data:", error.response?.data || error.message);
//         throw error;
//     }
// }

export { 
    getAllCategoryApi
};