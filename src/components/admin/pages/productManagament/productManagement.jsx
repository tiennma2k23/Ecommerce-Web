import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCirclePlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import './productManagement.css';

export default function ProductManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const navigate = useNavigate();

    const data = [
        { id: 200, name: "Nike Air Max 270", price: 150, quantity: 20, specialPrice: 135, discount: 10, description: "Giày chạy bộ cao cấp, nhẹ và thoáng khí", image: "nike_air_max_270.jpg" },
        { id: 201, name: "Adidas Ultraboost", price: 180, quantity: 15, specialPrice: 160, discount: 11, description: "Giày thể thao tăng hiệu suất chạy bộ", image: "adidas_ultraboost.jpg" },
        { id: 202, name: "Puma Future Rider", price: 120, quantity: 30, specialPrice: 105, discount: 12, description: "Giày thể thao với thiết kế hiện đại", image: "puma_future_rider.jpg" },
        { id: 203, name: "Under Armour Hovr", price: 140, quantity: 25, specialPrice: 125, discount: 10, description: "Giày tập gym với độ bền cao", image: "under_armour_hovr.jpg" },
        { id: 204, name: "New Balance 990v5", price: 170, quantity: 12, specialPrice: 155, discount: 9, description: "Giày chạy bộ chuyên dụng", image: "new_balance_990v5.jpg" },
        { id: 205, name: "Asics Gel-Kayano", price: 160, quantity: 18, specialPrice: 145, discount: 9, description: "Giày chạy bộ hỗ trợ đệm tốt", image: "asics_gel_kayano.jpg" },
        { id: 206, name: "Reebok Nano X", price: 130, quantity: 22, specialPrice: 115, discount: 11, description: "Giày thể thao đa năng cho tập luyện", image: "reebok_nano_x.jpg" },
        { id: 207, name: "Jordan Air Zoom", price: 190, quantity: 14, specialPrice: 175, discount: 8, description: "Giày bóng rổ chất lượng cao", image: "jordan_air_zoom.jpg" },
        { id: 208, name: "Fila Disruptor", price: 90, quantity: 35, specialPrice: 80, discount: 11, description: "Giày thời trang với thiết kế độc đáo", image: "fila_disruptor.jpg" },
        { id: 209, name: "Converse Chuck Taylor", price: 75, quantity: 40, specialPrice: 65, discount: 13, description: "Giày thể thao cổ điển", image: "converse_chuck_taylor.jpg" },
        { id: 210, name: "Skechers Go Run", price: 110, quantity: 28, specialPrice: 100, discount: 9, description: "Giày chạy bộ êm ái và nhẹ", image: "skechers_go_run.jpg" },
        { id: 211, name: "Mizuno Wave Rider", price: 130, quantity: 16, specialPrice: 115, discount: 12, description: "Giày chạy bộ chuyên dụng", image: "mizuno_wave_rider.jpg" },
        { id: 212, name: "Brooks Ghost", price: 150, quantity: 20, specialPrice: 135, discount: 10, description: "Giày chạy bộ thoải mái", image: "brooks_ghost.jpg" },
        { id: 213, name: "Hoka One One", price: 165, quantity: 18, specialPrice: 150, discount: 9, description: "Giày chạy đường dài chuyên nghiệp", image: "hoka_one_one.jpg" },
        { id: 214, name: "Vans Old Skool", price: 85, quantity: 50, specialPrice: 75, discount: 12, description: "Giày thời trang phong cách cổ điển", image: "vans_old_skool.jpg" }
    ];


    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1); 
    };

    const filteredData = data.filter(
        (item) => item.name.toLowerCase().includes(searchInput.toLowerCase()) 
    );

    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    const indexOfLastRecord = currentPage > totalPages ? 1 : currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleEdit = (product) => {
        navigate("/product-management/product-edit", { state: { product } });
    };

    return (
        <div className="product-container">
            <div className="product-body">
                <div className="product-header">
                    <h1>Danh sách sản phẩm</h1>
                    <div className="product-content">
                        <div className="product-search">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            <input
                                name="search"
                                placeholder="Tìm kiếm sản phẩm theo tên..."
                                value={searchInput}
                                onChange={handleChange}
                            />
                        </div>
                        <Link to="/product-management/product-create" className="btn-add">
                            <FontAwesomeIcon icon={faCirclePlus} />
                            <span>Thêm sản phẩm</span>
                        </Link>
                    </div>   
                </div>
                
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Giá ưu đãi</th>
                            <th>Giảm giá</th>
                            <th>Mô tả</th>
                            <th>Ảnh minh họa</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                                <td>{item.specialPrice}</td>
                                <td>{item.discount}</td>
                                <td>{item.description}</td>
                                <td>{item.image}</td>
                                <td>
                                    <div className="product-btn">
                                        <button className="btn-edit" onClick={() => handleEdit(item)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button className="btn-delete">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Trước
                </button>
                <span>Trang {currentPage} trên {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Sau
                </button>
            </div>
        </div>
    );
}
