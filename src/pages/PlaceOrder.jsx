import React, { useContext, useState } from 'react'; 
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
import { CheckOutCartApi, Payment } from '../axios/order';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, total, setQRCode, setCartItems } = useContext(ShopContext);
  const [loading, setLoading] = useState(false); // State loading

  const userId = localStorage.getItem("userId");
  const cartId = localStorage.getItem("cartId") || localStorage.getItem("defaultCartId");

  const [address, setAddress] = useState({
    doorNumber: '',
    street: '',
    district: '',
    city: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const isPhoneValid = (phone) => /^[0-9]{10,11}$/.test(phone);

  const handleCheckOutCart = async () => {
    if (!isPhoneValid(address.phone)) {
      alert("Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số).");
      return;
    }

    setLoading(true); // Bắt đầu loading
    try {
      console.log(cartId);
      await CheckOutCartApi(userId, cartId, address);

      if (localStorage.getItem('cartId')) localStorage.removeItem('cartId');

      if (method === 'cod') {
        setCartItems({});
        navigate('/');
        alert("Tạo đơn thành công. Thanh toán khi nhận hàng.");
      } else if (method === 'qr') {
        const data = await Payment(cartId, total);
        setQRCode(data);
        setCartItems({});
        navigate('/pay');
        alert("Tạo đơn thành công. Vui lòng thanh toán qua QR code.");
      }
    } catch (error) {
      console.log("API error response:", error.response);

      const errorMessage = error.response?.data || "Có lỗi xảy ra.";
      alert(errorMessage.includes("does not have enough stock")
        ? "Sản phẩm không đủ số lượng. Vui lòng thử lại."
        : errorMessage);
    } finally {
      setLoading(false); // Kết thúc loading
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
        <input className="border rounded py-1.5 px-3.5" type="text" name="doorNumber" placeholder="Số nhà" value={address.doorNumber} onChange={handleInputChange} />
        <input className="border rounded py-1.5 px-3.5" type="text" name="street" placeholder="Đường phố" value={address.street} onChange={handleInputChange} />
        <div className="flex gap-3">
          <input className="border rounded py-1.5 px-3.5" type="text" name="district" placeholder="Quận" value={address.district} onChange={handleInputChange} />
          <input className="border rounded py-1.5 px-3.5" type="text" name="city" placeholder="Thành phố" value={address.city} onChange={handleInputChange} />
        </div>
        <input className="border rounded py-1.5 px-3.5" type="tel" name="phone" placeholder="Phone" value={address.phone} onChange={handleInputChange} />
      </div>

      {/* Right Side */}
      <div className="mt-8">
        <CartTotal total={total} />

        <div className="mt-12">
          <Title text1={'PHƯƠNG THỨC'} text2={'THANH TOÁN'} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p>Thanh toán khi nhận hàng</p>
            </div>
            <div onClick={() => setMethod('qr')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'qr' ? 'bg-green-400' : ''}`}></p>
              <p>Thanh toán bằng QR code</p>
            </div>
          </div>

          {/* Nút ĐẶT HÀNG */}
          <div className="w-full text-end mt-8">
            <button
              onClick={handleCheckOutCart}
              className="bg-black text-white px-16 py-3 text-sm"
              disabled={loading} // Vô hiệu hóa nút khi loading
            >
              {loading ? "Vui lòng đợi..." : "ĐẶT HÀNG"} {/* Thay đổi text khi loading */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;