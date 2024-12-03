import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
      <ul>
        <li>{productDetail.id}</li>
        <li>{productDetail.title}</li>
        <li>{productDetail.category}</li>
        <li>
          <img src={productDetail.thumbnail} />
        </li>
        <li>{productDetail.price}</li>
        <li>{productDetail.rating}</li>
      </ul>
    </>
  );
}
export default ProductDetail;
