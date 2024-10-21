import React, { useState } from "react";
import './signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleRePasswordVisibility = () => {
        setShowRePassword(!showRePassword);
    };

    return (
        <div className="signup-page">
            <div className="signup-left">
                <img
                    src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
                    alt="logo-spotify"
                    className="signup-logo"
                />
                <div className="signupToLogin-btn">LOG IN</div>
            </div>
            <div className="signup-right">
                <div className="signup-text">Create a new account</div>
                <form className="signup-form">
                    <label htmlFor="userName" className="signup-label">Username</label>
                    <input type="text" id="userName" name="userName" />

                    <label htmlFor="email" className="signup-label">Email</label>
                    <input type="email" id="email" name="email" />

                    <label htmlFor="password" className="signup-label">Password</label>
                    <div className="signup-password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                            className="signup-toggle-password"
                            onClick={togglePasswordVisibility}
                        />
                    </div>

                    <label htmlFor="rePassword" className="signup-label">Re-Password</label>
                    <div className="signup-password-container">
                        <input
                            type={showRePassword ? "text" : "password"}
                            id="rePassword"
                            name="rePassword"
                        />
                        <FontAwesomeIcon
                            icon={showRePassword ? faEye : faEyeSlash}
                            className="signup-toggle-password"
                            onClick={toggleRePasswordVisibility}
                        />
                    </div>
                </form>
                <a>
                    <div className="signup-btn">SIGN UP</div>
                </a>
            </div>
        </div>
    );
}