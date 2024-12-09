import React, { useContext, useState } from 'react'; 
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
import { CheckOutCartApi } from '../axios/order';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate } = useContext(ShopContext);

  const userId = localStorage.getItem("userId");
  const cartId = localStorage.getItem("cartId") ? localStorage.getItem("cartId") : localStorage.getItem("defaultCartId");

  // State lưu thông tin địa chỉ
  const [address, setAddress] = useState({
    doorNumber: '',
    street: '',
    district: '',
    city: '',
  });

  // Hàm xử lý khi người dùng nhập vào input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi nhấn nút "PLACE ORDER"
  const handleCheckOutCart = async () => {
    try {
        console.log(cartId);
      await CheckOutCartApi(userId, cartId, address); // Truyền state address vào đây
      if (localStorage.getItem('cartId'))
        localStorage.removeItem('cartId');
      navigate('/orders');
      alert("Tạo đơn thành công");
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        {/* Input Fields */}
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          name="doorNumber"
          placeholder="Door Number"
          value={address.doorNumber}
          onChange={handleInputChange}
        />
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          name="street"
          placeholder="Street"
          value={address.street}
          onChange={handleInputChange}
        />
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="district"
            placeholder="District"
            value={address.district}
            onChange={handleInputChange}
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* Payment Method Selection */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod('cod')}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === 'cod' ? 'bg-green-400' : ''
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              onClick={handleCheckOutCart}
              className="bg-black text-white px-16 py-3 text-sm"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;