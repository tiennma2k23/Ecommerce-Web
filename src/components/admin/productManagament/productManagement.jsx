import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCirclePlus, faPenToSquare, faTrash, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import { getAllCategoryApi } from "../../../axios/category";
import { getAllProductApi, deleteProductApi } from "../../../axios/product";
import './productManagement.css';

export default function ProductManagement() {
    const [categorys, setCategorys] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showCategoryList, setShowCategoryList] = useState(false);
    const [product, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");
    const categoryListRef = useRef(null);

    const storedToken = localStorage.getItem("authToken");

    const handleChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        async function fetchProducts() {
            if (!storedToken) {
                console.error("Token không tồn tại trong localStorage");
                return;
            }

            try {
                const data = await getAllProductApi(storedToken);
                console.log("Danh sách sản phẩm:", data);
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Không thể lấy danh sách sản phẩm:", error);
                setProducts([]); 
            }
        }

        fetchProducts();
    }, []);

    const filteredData = product.filter(
        (item) =>
            item.name.toLowerCase().includes(searchInput.toLowerCase()) &&
            (selectedCategory ? item.category.name === selectedCategory : true)
    );

    const totalPages = Math.max(Math.ceil(filteredData.length / recordsPerPage), 1);

    const indexOfLastRecord = Math.min(currentPage * recordsPerPage, filteredData.length);
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

    const handleCategory = async () => {
        if (!storedToken) {
            console.error("Token không tồn tại trong localStorage");
            return;
        }
        try {
            const response = await getAllCategoryApi(storedToken);
            setCategorys(Array.isArray(response) ? response : []);
            setShowCategoryList(!showCategoryList); 
        } catch (error) {
            console.error("Không thể lấy danh sách danh mục:", error);
        }
    };

    const selectCategory = (categoryName) => {
        setSelectedCategory(categoryName);
        setShowCategoryList(false);
        setCurrentPage(1);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryListRef.current && !categoryListRef.current.contains(event.target)) {
                setShowCategoryList(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleEdit = (product) => {
        navigate("/admin/product-management/product-edit", { state: { product } });
    };

    const handleDelete = async (id) => {
        if (!storedToken) {
            console.error("Token không tồn tại trong localStorage");
            return;
        }
    
        try {
            await deleteProductApi(storedToken, id); // Truyền token vào hàm API
            // Sau khi xóa thành công, cập nhật danh sách sản phẩm
            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
            console.log(`Sản phẩm có ID ${id} đã được xóa thành công.`);
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    };

    return (
        <div className="product-container">
            <div className="product-body">
                <div className="product-header">
                    <div className="product-btn">
                        <h1>Danh sách sản phẩm</h1>
                        <Link to="/admin/product-management/product-create" className="btn-add">
                                <FontAwesomeIcon icon={faCirclePlus} />
                                <span>Thêm sản phẩm</span>
                        </Link>
                    </div>
                    <div className="product-content">
                        <div className="pro-con-left">
                            <span>Tên sản phẩm</span>
                            <div className="product-search">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                                <input
                                    name="search"
                                    placeholder="Tìm kiếm sản phẩm theo tên..."
                                    value={searchInput}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <label htmlFor="category">
                            <span>Danh mục</span>
                            <div className="product-search">
                                <input 
                                    type="text" 
                                    id="category" 
                                    name="category" 
                                    value={selectedCategory || ""}
                                    onClick={handleCategory}
                                    readOnly 
                                />
                                {showCategoryList && (
                                    <ul className="category-selection" ref={categoryListRef}>
                                        {categorys.map((cat, index) => (
                                            <li 
                                                key={index} 
                                                onClick={() => selectCategory(cat.name)}
                                            >
                                                {cat.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <FontAwesomeIcon icon={faChevronDown}  className="icon-down"/>
                            </div>
                        </label>
                    </div>
                </div>

                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Mô tả</th>
                            <th>Ảnh minh họa</th>
                            <th>Danh mục</th> {/* Cột danh mục */}
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td className="table-cell">{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                                <td className="table-cell">{item.description}</td>
                                <td>
                                    {item.image_1 ? (
                                        <img 
                                            src={item.image_1.startsWith("data:image/") ? item.image_1 : `data:image/jpeg;base64,${item.image_1}`} 
                                            alt={item.name} 
                                            style={{ width: "50px", height: "55px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <span>Không có ảnh</span>
                                    )}
                                </td>
                                <td>{item.category.name}</td> {/* Hiển thị tên danh mục */}
                                <td>
                                    <div className="product-btn">
                                        <button className="btn-edit" onClick={() => handleEdit(item)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(item.id)}>
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