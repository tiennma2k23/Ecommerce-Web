import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { CreateCartApi, GetCartApi } from '../axios/order';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, navigate, setTotal } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState(1); // Quản lý số lượng
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');
  const cartId = localStorage.getItem('defaultCartId');

  // Lấy dữ liệu sản phẩm
  const fetchProductData = () => {
    products.forEach((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const handleCreateCart = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Bạn cần đăng nhập để thực hiện thao tác này.");
        setTimeout(() => navigate("/login"), 2000); // Điều hướng đến trang login sau 2 giây
        return;
      }
  
      const cart = await CreateCartApi(userId);
      addToCart(cart.id, productData._id, quantity);
      const updatedCart = await GetCartApi(cart.id);
      console.log(updatedCart);
      setTotal(updatedCart.total);
      localStorage.setItem("cartId", cart.id);
      navigate('/place-order');
    } catch (error) {
      if (error.isAuthError) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };  

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Quantity</p>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="border py-2 px-4"
            />
          </div>
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
              {error}
            </div>
          )}
          <div className="flex justify-between">
            <button
              onClick={() => addToCart(cartId, productData._id, quantity)}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              ADD TO CART
            </button>
            <button
              onClick={() => handleCreateCart(productData._id, quantity)}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              BUY
            </button>
          </div>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description & Review Section */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            A lightweight, usually knitted, pullover shirt, close-fitting and
            with a round neckline and short sleeves, worn as an undershirt or
            outer garment.
          </p>
          <p>
            A lightweight, usually knitted, pullover shirt, close-fitting and
            with a round neckline and short sleeves, worn as an undershirt or
            outer garment.
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;