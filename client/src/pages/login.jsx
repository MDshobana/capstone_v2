
import { useContext } from "react";
import { AuthContext } from "../components/authContext";
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from '../pages/register';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { setUser } = useContext(AuthContext);
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

        axios.post('http://localhost:5000/api/auth/login', formData, {withCredentials: true} ).then(response => {
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
        <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">Welcome to the Learning Portal</h1>
                <p className="mt-10 text-center text-sm/6 text-gray-600">Don't have an account?
                    <Link className="font-semibold text-indigo-400 hover:text-indigo-300" to='/'> Create an account </Link>
                </p>
                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm/6 font-medium text-black-100" htmlFor="Email">Email: </label>
                            <div className="mt-2">
                                <input className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base text-black outline-1 outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm/6 font-medium text-black-100" htmlFor="password">Password: </label>

                                <div className="text-sm">
                                    <Link className="font-semibold text-indigo-400 hover:text-indigo-300" to='/forgotpassword'>Forgot Password?</Link>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mt-2">
                                <input className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base text-black outline-1 outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>
                        <div>
                            <button className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" type="submit">Login</button>
                        </div>
                    </form>
                </div>
                <div className="flex w-full justify-center rounded-md  mt-6 px-3 py-1.5 text-sm/6 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            // console.log(credentialResponse);
                            try {
                                await axios.post('http://localhost:5000/api/auth/google-login', { token: credentialResponse.credential })
                            } catch (error) {
                                console.log('Google Login Failed:', error.response?.data || error.message);
                            }

                        }}
                        onError={(error) => {
                            console.log('Login Failed:', error)
                        }
                        } />
                </div>

            </div>
        </>
    )
}

export default Login