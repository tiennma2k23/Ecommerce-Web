import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import Product from "../pages/Product";
import { useNavigate } from "react-router-dom";
import { LogoutApi } from "../axios/axios";
import { AddProductToCartApi, GetCartApi, updateQuantityItem, removeItem, clearCart } from "../axios/order";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'đ';
    const delivery_fee = 20000;
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems,setCartItems] = useState({});
    // Lấy trạng thái từ localStorage (mặc định là false nếu chưa có giá trị)
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return JSON.parse(localStorage.getItem("isAuthenticated")) || false;
    });

    const navigate = useNavigate();

    // Hàm để cập nhật trạng thái xác thực và lưu vào localStorage
    const handleAuthentication = (value) => {
        setIsAuthenticated(value);
        localStorage.setItem("isAuthenticated", JSON.stringify(value));
    };

    const addToCart = async (cartId, productId, quantity) => {
    
        try {    
            // Gọi API để thêm sản phẩm vào giỏ hàng
            const addResponse = await AddProductToCartApi(cartId, productId, quantity);
            if (addResponse !== "Item added to cart") {
                toast.error('Failed to add product to cart');
                return;
            }
    
            // Gọi API để lấy dữ liệu giỏ hàng mới
            const updatedCartData = await GetCartApi(cartId);
    
            // Cập nhật trạng thái cartItems
            setCartItems(updatedCartData);
    
            toast.success('Product added to cart');
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error('Error adding product to cart');
        }
    };       

    const getCartCount = () => {
        let totalCount = 0;
    
        // Kiểm tra nếu cartItems là mảng hoặc đối tượng chứa mảng items
        const itemsArray = Array.isArray(cartItems) ? cartItems : cartItems.items || [];
    
        itemsArray.forEach(item => {
            if (item.quantity > 0) {
                totalCount += item.quantity;
            }
        });
    
        return totalCount;
    };         

    const updateQuantity = async (cartId, itemId, quantity) => {
        const cartData = await updateQuantityItem(cartId, itemId, quantity);
        if (cartData !== "Cart item quantity updated successfully") {
            toast.error('Failed to update quantity product');
            return;
        }

        const updatedCartData = await GetCartApi(cartId);

        setCartItems(updatedCartData.items);
    }

    const removeCartItem = async (cartId, itemId) => {
        const cartData = await removeItem(cartId, itemId);

        const updatedCartData = await GetCartApi(cartId);

        setCartItems(updatedCartData.items);
    }

    const removeAllCart = async (cartId) => {
        const cartData = await clearCart(cartId);

        const updatedCartData = await GetCartApi(cartId);

        setCartItems(updatedCartData.items);
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
        products, currency, delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount,updateQuantity, removeCartItem, removeAllCart,
        getCartAmount, navigate, 
        isAuthenticated, setIsAuthenticated, handleAuthentication, logout
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;