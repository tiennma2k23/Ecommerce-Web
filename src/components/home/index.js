import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../auth/signup";
import Login from "../auth/login";
import UserManagement from "../admin/userManagement/userManagement";
import UserCreate from "../admin/userManagement/userCreate";
import UserEdit from "../admin/userManagement/userEdit";
import ProductManagement from "../admin/productManagament/productManagement";
import ProductCreate from "../admin/productManagament/productCreate";
import ProductEdit from "../admin/productManagament/productEdit";
import LoanDetail from "../admin/sell/loanDetail";

export default function Home() {
    return (
        <Router>
            <div className="main-body">
                <Routes>
                    <Route path="/" element={<UserManagement />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/user-management" element={<UserManagement />} />
                    <Route path="/user-management/user-create" element={<UserCreate />} />
                    <Route path="/user-management/user-edit" element={<UserEdit />} />
                    <Route path="/product-management" element={<ProductManagement />} />
                    <Route path="/product-management/product-create" element={<ProductCreate />} />
                    <Route path="/product-management/product-edit" element={<ProductEdit />} />
                    <Route path="/loan/loan-detail" element={<LoanDetail />} />
                </Routes>
            </div>
        </Router>
    );
}
