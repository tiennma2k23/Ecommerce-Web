import logo from './logo.png'
import hero_img from './hero_img.png'
import cart_icon from './cart_icon.png'
import bin_icon from './bin_icon.png'
import dropdown_icon from './dropdown_icon.png'
import exchange_icon from './exchange_icon.png'
import profile_icon from './profile_icon.png'
import quality_icon from './quality_icon.png'
import search_icon from './search_icon.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import support_img from './support_img.png'
import menu_icon from './menu_icon.png'
import about_img from './about_img.png'
import contact_img from './contact_img.png'
import stripe_logo from './stripe_logo.png'
import cross_icon from './cross_icon.png'
import vnpay_logo from './vnpay.png'
import zalopay_logo from './zalopay_logo.png'
import { GetProductApi } from '../axios/axios'
import { data } from 'autoprefixer'

export const assets = {
    logo,
    hero_img,
    cart_icon,
    dropdown_icon,
    exchange_icon,
    profile_icon,
    quality_icon,
    search_icon,
    star_dull_icon,
    star_icon,
    bin_icon,
    support_img,
    menu_icon,
    about_img,
    contact_img,
    stripe_logo,
    cross_icon,
    vnpay_logo,
    zalopay_logo
}
    
export const products = [];

let productData = [];

function formatProductData(product) {
    const defaultData = {
        _id: "",
        name: "Unnamed Product",
        description: "Description not available",
        price: 0,
        image: [],
        category: "Uncategorized",
        subCategory: "Unknown",
        sizes: ["S", "M", "L"],
        date: Date.now(),
        bestseller: true,
        quantity: 0, // Bổ sung trường không có trong cấu trúc ban đầu
    };

    // Hàm xử lý một đối tượng sản phẩm
    const formatSingleProduct = (prod) => {
        const images = [];
        for (let i = 1; i <= 5; i++) {
            if (prod[`image_${i}`]) images.push(prod[`image_${i}`]);
        }

        return {
            ...defaultData,
            _id: prod.id?.toString() || defaultData._id,
            name: prod.name || defaultData.name,
            description: prod.description || defaultData.description,
            price: prod.price || defaultData.price,
            image: images.length > 0 ? images : defaultData.image,
            category: prod.category?.name || defaultData.category,
            subCategory: prod.subCategory || defaultData.subCategory,
            sizes: prod.sizes || defaultData.sizes,
            date: prod.date || defaultData.date,
            bestseller: prod.bestseller ?? defaultData.bestseller,
            quantity: prod.quantity || defaultData.quantity,
        };
    };

    // Kiểm tra nếu `product` là mảng
    if (Array.isArray(product)) {
        return product.map(formatSingleProduct); // Lặp qua từng sản phẩm và định dạng
    }

    // Nếu không phải mảng, xử lý như sản phẩm đơn lẻ
    if (product) {
        return formatSingleProduct(product);
    }

    return [];
}

// Hàm lấy dữ liệu và gán vào biến toàn cục
async function fetchProductData() {
    try {
        productData = await GetProductApi(); // Gán dữ liệu vào biến toàn cục
        console.log('Fetched Product Data:', productData); // Kiểm tra dữ liệu
        let newData = formatProductData(productData);
        products.push(...newData);
        console.log(products);
        return products;
    } catch (error) {
        console.error('Failed to fetch product data:', error.message);
    }
}

// Gọi hàm để lấy dữ liệu
fetchProductData();

// Sử dụng dữ liệu sau khi đã gán
// setTimeout(() => {
//     console.log('Product Data in Global Variable:', productData); // Dữ liệu có sẵn ở đây
// }, 1000);