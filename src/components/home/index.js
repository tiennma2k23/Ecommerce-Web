import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Signup from "../auth/signup";

export default function Home() {
    return (
        <Router>
            <div className="main-body">
                <Signup />
            </div>
        </Router>
    )
}