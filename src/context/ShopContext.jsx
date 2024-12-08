import { createContext, useEffect, useState } from "react";
import { products, formatProductData } from "../assets/assets";
import { toast } from "react-toastify";
import Product from "../pages/Product";
import { useNavigate } from "react-router-dom";
import { LogoutApi, GetProductApi } from "../axios/axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'đ';
    const delivery_fee = 20000;
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems,setCartItems] = useState({});
    const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
    const [loadingProducts, setLoadingProducts] = useState(true); // Trạng thái tải sản phẩm
    // Lấy trạng thái từ localStorage (mặc định là false nếu chưa có giá trị)
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return JSON.parse(localStorage.getItem("isAuthenticated")) || false;
    });

    const navigate = useNavigate();

    // Hàm lấy dữ liệu sản phẩm
    const fetchProductData = async () => {
        try {
            const productData = await GetProductApi(); // Gọi API lấy sản phẩm
            const formattedData = formatProductData(productData); // Định dạng dữ liệu
            setProducts(formattedData); // Cập nhật state sản phẩm
        } catch (error) {
            console.error('Failed to fetch product data:', error.message);
            toast.error('Failed to load products. Please try again.');
        } finally {
            setLoadingProducts(false); // Kết thúc trạng thái loading
        }
    };

    // Gọi fetchProductData khi component được mount
    useEffect(() => {
        fetchProductData();
    }, []);

    // Hàm để cập nhật trạng thái xác thực và lưu vào localStorage
    const handleAuthentication = (value) => {
        setIsAuthenticated(value);
        localStorage.setItem("isAuthenticated", JSON.stringify(value));
    };

    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);
        console.log(cartData);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

    }

    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    } 
                } catch (error) {
                    
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId,size,quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData);
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalAmount;
    }

    const logout = async () => {
        try {
          const token = localStorage.getItem('authToken'); // Lấy token từ localStorage
      
          if (!token) {
            console.warn('No token found. Proceeding to clear session.');
          } else {
            await LogoutApi(token); // Gọi API logout
            console.log('Logged out successfully from server.');
          }
        } catch (error) {
          console.error('Error during logout:', error.response ? error.response.data : error.message);
          alert('Failed to log out from server, but session will be cleared locally.');
        } finally {
          // Dù thành công hay lỗi, vẫn xóa localStorage và điều hướng
          setIsAuthenticated(false);
          localStorage.clear();
          navigate('/login');
        }
    };
    
    const value = {
        products, loadingProducts, currency, delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        cartItems,addToCart,
        getCartCount,updateQuantity,
        getCartAmount, navigate, 
        isAuthenticated, setIsAuthenticated, handleAuthentication, logout
    }

    return (
        <ShopContext.Provider value={value}>
            {loadingProducts ? <div>Loading products...</div> : props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;