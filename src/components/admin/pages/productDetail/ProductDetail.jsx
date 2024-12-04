import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GroceryIcon from "../../components/Assets/product-detail/grocery.svg"
import "./productDetail.css"
import axios from "axios";

function ProductDetail() {
  //lấy tham số của đường dẫn động
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState();
  const fetchData = async () => {
    await axios
      .get(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (res.status === 200) setProductDetail(res.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  console.log(productDetail);
  if (!productDetail) {
    return <p>Loading...</p>; // Hiển thị Loading khi chưa có dữ liệu
  }
  return (
    <>
      <div className="product-detail">
        <div className="thumbnails">
          <div className="main-thumbnail">
            <img src={productDetail.thumbnail} className="img-thumbnail" />
          </div>
          <div className="product-thumbnails">
            <img src={productDetail.thumbnail} className="product-thumbnail" />
            <img src={productDetail.thumbnail} />
          </div>
        </div>
        <div className="detail">
          <div className="product-title">{productDetail.title}</div>
          <div className="price-category">
            <div className="product-price">{productDetail.price} VNĐ</div>
            <div className="category">
              <span className="product-category">Danh mục </span>
              <img src={GroceryIcon} alt="" className="icon-category" />
              <div className="product-category">{productDetail.category}</div>
            </div>
          </div>
          <div className="product-quantity">{productDetail.stock}</div>
          <div className="product-quantity">{productDetail.description}</div>
        </div>

      </div>
    </>
  );
}
export default ProductDetail;
