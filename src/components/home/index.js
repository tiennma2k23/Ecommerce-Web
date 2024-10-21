import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Signup from "../auth/signup";
import Login from "../auth/login";

export default function Home() {
    return (
        <Router>
            <div className="main-body">
                <Signup />
                {/* <Login /> */}
            </div>
        </Router>
    )
}