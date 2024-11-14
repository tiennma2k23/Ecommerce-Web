import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import './userManagement.css';

export default function UserManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const navigate = useNavigate();

    const data = [
        { id: 100, email: "A@gmail.com", name: "Apple", phone: "09984744883", address: "Hanoi" },
        { id: 101, email: "B@gmail.com", name: "Banana", phone: "09984744884", address: "Saigon" },
        { id: 102, email: "C@gmail.com", name: "Cherry", phone: "09984744885", address: "Danang" },
        { id: 103, email: "D@gmail.com", name: "Date", phone: "09984744886", address: "Hue" },
        { id: 104, email: "E@gmail.com", name: "Elderberry", phone: "09984744887", address: "Can Tho" },
        { id: 105, email: "F@gmail.com", name: "Fig", phone: "09984744888", address: "Nha Trang" },
        { id: 106, email: "G@gmail.com", name: "Grape", phone: "09984744889", address: "Hai Phong" },
        { id: 107, email: "H@gmail.com", name: "Honeydew", phone: "09984744890", address: "Ha Long" },
        { id: 108, email: "I@gmail.com", name: "Indian Fig", phone: "09984744891", address: "Da Lat" },
        { id: 109, email: "J@gmail.com", name: "Jackfruit", phone: "09984744892", address: "Quy Nhon" },
        { id: 110, email: "K@gmail.com", name: "Mango", phone: "09984744892", address: "Ho Chi Minh" },
        { id: 111, email: "M@gmail.com", name: "Lemon", phone: "09984744892", address: "Nam Dinh" },
        { id: 112, email: "L@gmail.com", name: "Egg", phone: "09984744892", address: "Thai Binh" },
        { id: 113, email: "N@gmail.com", name: "Tomato", phone: "09984744892", address: "Da Nang" },
        { id: 114, email: "O@gmail.com", name: "Potato", phone: "09984744892", address: "Quang Tri" },
    ];

    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1); 
    };

    const filteredData = data.filter(
        (item) =>
            item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            item.email.toLowerCase().includes(searchInput.toLowerCase()) ||
            item.phone.includes(searchInput)
    );

    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    
    // Kiểm tra và đưa currentPage về trang đầu nếu cần
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

    const handleEdit = (user) => {
        navigate("/user-management/user-edit", { state: { user } });
    };

    return (
        <div className="user-container">
            <div className="user-header">
                <h1>Quản lý tài khoản</h1>
                <div className="user-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        name="search"
                        placeholder="Nhập Tên/ Email/ Số điện thoại"
                        value={searchInput}
                        onChange={handleChange}
                    />
                </div>
                <Link to="/user-management/user-create" className="btn-add">Thêm tài khoản</Link>
            </div>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Tên</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.email}</td>
                            <td>{item.name}</td>
                            <td>{item.phone}</td>
                            <td>{item.address}</td>
                            <td>
                                <div className="user-btn">
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
