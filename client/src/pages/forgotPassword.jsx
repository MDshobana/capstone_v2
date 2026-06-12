import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${API_URL}/api/auth/forgotpassword`, { email });

            setMessage("✅ Reset email sent! Check your inbox.");
            setEmail("");

        } catch (err) {
            console.error(err);
            setMessage("❌ Failed to send reset email");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Forgot Password
                </h1>

                <p className="text-sm text-gray-500 text-center mb-6">
                    Enter your email to receive a reset link
                </p>

                <form onSubmit={handleForgotPassword} className="space-y-4">

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Send Reset Link
                    </button>

                </form>

                {message && (
                    <p className="mt-4 text-center text-sm text-gray-600">
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}


export function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState("");

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage("❌ Passwords do not match");
            return;
        }

        try {
            await axios.post(
                `${API_URL}/api/auth/resetpassword/${token}`,
                { newPassword: passwordData.newPassword }
            );

            setMessage("✅ Password reset successful! Redirecting...");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            console.error(err);
            setMessage("❌ Failed to reset password");
        }
    };

    const handleChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Reset Password
                </h1>

                <form onSubmit={handleResetPassword} className="space-y-4">

                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={passwordData.newPassword}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={passwordData.confirmPassword}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Reset Password
                    </button>

                </form>

                {message && (
                    <p className="mt-4 text-center text-sm text-gray-600">
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}