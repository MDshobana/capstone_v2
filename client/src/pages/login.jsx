
import { useContext } from "react";
import { AuthContext } from "../components/authContext";
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from '../pages/register';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
    const { setUser } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email) {
            setError("Email required");
        }

        axios.post(`${API_URL}/api/auth/login`, formData, { withCredentials: true }).then(response => {
            if (response.status === 200) {
                console.log('Login successful :', response.data)
                setUser(response.data.user);
                const role = response.data.user.role;
                if (role === "admin") {
                    navigate("/admin-dashboard");
                } else if (role === "student") {
                    navigate("/student-dashboard");
                } else if (role === "trainer") {
                    navigate("/trainer-dashboard");
                } else if (role === "company") {
                    navigate("/company-dashboard");
                } else {
                    console.error('Unknown user role:', role);
                }
            } else {
                console.log('Login failed')
            }
        }).catch(error => {

            console.error('An error occurred during login:', error.response?.data || error.message);
        });
    };



    return (

        <div className="min-h-screen grid md:grid-cols-2">

            {/* ✅ LEFT PANEL */}
            <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-purple-600 text-white p-10">

                <h1 className="text-4xl font-bold mb-4">
                    MyLearning Portal 🚀
                </h1>

                <p className="text-lg text-center max-w-md">
                    Learn new skills, complete assignments, and get hired.
                </p>

            </div>

            {/* ✅ RIGHT PANEL (FORM) */}
            <div className="flex items-center justify-center bg-gray-50">

                <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Welcome Back 👋
                    </h2>

                    <p className="text-center text-sm mb-4">
                        Don’t have an account?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            className="text-blue-600 cursor-pointer"
                        >
                            Register
                        </span>
                    </p>

                    {/* ✅ FORM */}
                    <form className="space-y-5" onSubmit={handleSubmit}>

                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                            required
                        />

                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                                required
                            />

                            <div className="text-right mt-2">
                                <Link
                                    to="/forgotpassword"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Login
                        </button>

                    </form>

                    {/* ✅ GOOGLE LOGIN */}
                    <div className="mt-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    const response = await axios.post(
                                        `${API_URL}/api/auth/google-login`,
                                        { token: credentialResponse.credential },
                                        {
                                            headers: { "Content-Type": "application/json" },
                                            withCredentials: true
                                        }
                                    );

                                    setUser(response.data.user);

                                    const role = response.data.user.role;

                                    if (role === "admin") navigate("/admin-dashboard");
                                    else if (role === "student") navigate("/student-dashboard");
                                    else if (role === "trainer") navigate("/trainer-dashboard");
                                    else if (role === "company") navigate("/company-dashboard");

                                } catch (error) {
                                    console.error("Google login error:", error.response?.data || error.message);
                                }
                            }}
                            onError={(error) => console.log("Login Failed:", error)}
                        />
                    </div>

                </div>

            </div>

        </div>
    );
    // <>
    //     <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    //         <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">Welcome to the Learning Portal</h1>
    //         <p className="mt-10 text-center text-sm/6 text-gray-600">Don't have an account?
    //             <Link className="font-semibold text-indigo-400 hover:text-indigo-300" to='/'> Create an account </Link>
    //         </p>
    //         <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
    //             <form className="space-y-6" onSubmit={handleSubmit}>
    //                 <div>
    //                     <label className="block text-sm/6 font-medium text-black-100" htmlFor="Email">Email: </label>
    //                     <div className="mt-2">
    //                         <input className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base text-black outline-1 outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
    //                     </div>
    //                 </div>
    //                 <div>
    //                     <div className="flex items-center justify-between">
    //                         <label className="block text-sm/6 font-medium text-black-100" htmlFor="password">Password: </label>

    //                         <div className="text-sm">
    //                             <Link className="font-semibold text-indigo-400 hover:text-indigo-300" to='/forgotpassword'>Forgot Password?</Link>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <div>
    //                     <div className="mt-2">
    //                         <input className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base text-black outline-1 outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
    //                     </div>
    //                 </div>
    //                 <div>

    //                     {error && (
    //                         <p style={{ color: "red", textAlign: "center" }}>
    //                             {error}
    //                         </p>
    //                     )}

    //                     <button className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" type="submit">Login</button>
    //                 </div>
    //             </form>
    //         </div>
    //         <div className="flex w-full justify-center rounded-md  mt-6 px-3 py-1.5 text-sm/6 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2">
    //             <GoogleLogin
    //                 onSuccess={async (credentialResponse) => {
    //                     // console.log(credentialResponse);
    //                     try {
    //                         const response = await axios.post(`${API_URL}/api/auth/google-login`, { token: credentialResponse.credential },
    //                             {
    //                                 headers: {
    //                                     "Content-Type": "application/json"
    //                                 },
    //                                 withCredentials: true 
    //                             }
    //                         );
    //                         setUser(response.data.user);
    //                         const role = response.data.user.role;
    //                         if (role === "admin") {
    //                             navigate("/admin-dashboard");
    //                         } else if (role === "student") {
    //                             navigate("/student-dashboard");
    //                         } else if (role === "trainer") {
    //                             navigate("/trainer-dashboard");
    //                         } else if (role === "company") {
    //                             navigate("/company-dashboard");
    //                         } else {
    //                             console.error('Unknown user role:', role);
    //                         }
    //                     } catch (error) {
    //                         console.error('An error occurred during Google login:', error.response?.data || error.message);
    //                     }
    //                 }} onError={(error) => {
    //                     console.log('Login Failed:', error)
    //                 }
    //                 } />
    //         </div>

    //     </div>
    // </>

}

export default Login