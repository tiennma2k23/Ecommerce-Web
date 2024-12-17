import React, { useContext, useState } from 'react'; 
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
import { CheckOutCartApi, Payment } from '../axios/order';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, total, setQRCode, setCartItems } = useContext(ShopContext);

  const userId = localStorage.getItem("userId");
  const cartId = localStorage.getItem("cartId") ? localStorage.getItem("cartId") : localStorage.getItem("defaultCartId");

  // State lưu thông tin địa chỉ
  const [address, setAddress] = useState({
    doorNumber: '',
    street: '',
    district: '',
    city: '',
    phone: ''
  });

  // Hàm xử lý khi người dùng nhập vào input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const isPhoneValid = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/; // Chỉ chấp nhận 10-11 chữ số
    return phoneRegex.test(phone);
  };  

  const handleCheckOutCart = async () => {
    if (!isPhoneValid(address.phone)) {
      alert("Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số).");
      return;
    }
    try {
      console.log(cartId);
      await CheckOutCartApi(userId, cartId, address); // Gọi API checkout
      if (localStorage.getItem('cartId')) localStorage.removeItem('cartId');
      console.log(total);
      const data = await Payment(cartId, total);
      console.log("data: ", data);
      setQRCode(data);
      setCartItems({});
      navigate('/pay');
      alert("Tạo đơn thành công");
    } catch (error) {
      console.log("API error response:", error.response);
  
      if (error.response && error.response.data) {
        const errorMessage = error.response.data || "Có lỗi xảy ra."; // Lấy thông báo từ `data`
        console.error("Error during checkout:", errorMessage);
  
        // Kiểm tra nếu lỗi liên quan đến số lượng sản phẩm
        if (errorMessage.includes("does not have enough stock")) {
          alert("Sản phẩm không còn đủ số lượng trong kho. Vui lòng chọn sản phẩm khác.");
        } else {
          alert(errorMessage); // Hiển thị lỗi khác (nếu có)
        }
      } else {
        console.error("Unexpected error:", error);
        alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau.");
      }
    }
  };  

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={'THÔNG TIN'} text2={'GIAO HÀNG'} />
        </div>

        {/* Input Fields */}
        <input
          className="font-sans border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          name="doorNumber"
          placeholder="Số nhà"
          value={address.doorNumber}
          onChange={handleInputChange}
        />
        <input
          className="font-sans border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          name="street"
          placeholder="Đường phố"
          value={address.street}
          onChange={handleInputChange}
        />
        <div className="flex gap-3">
          <input
            className="font-sans border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="district"
            placeholder="Quận"
            value={address.district}
            onChange={handleInputChange}
          />
          <input
            className="font-sans border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="city"
            placeholder="Thành phố (Tỉnh)"
            value={address.city}
            onChange={handleInputChange}
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="tel"
          name="phone"
          placeholder="Phone (10-11 digits)"
          value={address.phone}
          onChange={handleInputChange}
        />
        <small className="text-gray-400">Nhập số điện thoại gồm 10-11 chữ số</small>
      </div>

      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal total={total}/>
        </div>

        <div className="mt-12">
          <Title text1={'PHƯƠNG THỨC'} text2={'THANH TOÁN'} />
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
              <p className="font-sans text-gray-500 text-sm font-medium mx-4">
                Thanh toán khi nhận hàng
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              onClick={handleCheckOutCart}
              className="font-sans bg-black text-white px-16 py-3 text-sm"
            >
              ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;