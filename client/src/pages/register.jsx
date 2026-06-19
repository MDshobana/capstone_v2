import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function Register() {
    const [regFormData, setregFormData] = useState({
        firstName: '',
        lastName: '',
        age: 0,
        email: '',
        password: '',
        role: 'student'

    })
    const navigate = useNavigate();


    const handleChange = (e) => {
        setregFormData({ ...regFormData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/auth/register`, regFormData);
            navigate("/login");
        } catch (error) {
            console.log("An error occurred during registeration:", error.response?.data || error.message);
        };
    }
    return (

        <div className="min-h-screen grid md:grid-cols-2">


            <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-purple-600 text-white p-10">

                <h1 className="text-4xl font-bold mb-4">
                    MyLearning Portal 🚀
                </h1>

                <p className="text-lg text-center max-w-md">
                    Learn new skills, complete assignments, and land your dream job.
                </p>

            </div>


            <div className="flex items-center justify-center bg-gray-50">

                <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Create Account
                    </h2>

                    <p className="text-center text-sm mb-4">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-blue-600 cursor-pointer"
                        >
                            Login
                        </span>
                    </p>


                    <form className="space-y-4" onSubmit={handleSubmit}>

                        <input
                            type="text"
                            placeholder="First Name"
                            name='firstName'
                            value={regFormData.firstName}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="text"
                            placeholder="Last Name"
                            name='lastName'
                            value={regFormData.lastName}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                        />

                        <input
                            type="number"
                            placeholder="Age"
                            name='age'
                            value={regFormData.age}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            name='email'
                            value={regFormData.email}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            name='password'
                            value={regFormData.password}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                        />

                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                            Register
                        </button>

                    </form>

                </div>

            </div>
        </div>);
    {/* <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">Welcome to the MyLearning Portal</h1>
                <p className="mt-10 text-center text-sm/6 text-gray-600">Already have an account?
                    <Link className="font-semibold text-indigo-400 hover:text-indigo-300" to='/login'> Login </Link>
                </p>
                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm/6 font-medium text-black-100" htmlFor="firstName">First Name: </label>
                            <div className="mt-2">
                                <input className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base text-black outline-1 outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" type="text" id="firstName" name="firstName" value={regFormData.firstName} onChange={handleChange} required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm/6 font-medium text-black-100" htmlFor="lastName">Last Name: </label>
                            <div className="mt-2">
                                <input className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base text-black outline-1 outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" type="text" id="lastName" name="lastName" value={regFormData.lastName} onChange={handleChange} required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm/6 font-medium text-black-100" htmlFor="age">Age: </label>
                            <div className="mt-2">
                                <input className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base text-black outline-1 outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" type="number" id="age" name="age" value={regFormData.age} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm/6 font-medium text-black-100" htmlFor="email">Email: </label>
                            <div className="mt-2">
                                <input className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base text-black outline-1 outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" type="email" id="email" name="email" value={regFormData.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm/6 font-medium text-black-100" htmlFor="password">Password: </label>
                            <div className="mt-2">
                                <input className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base text-black outline-1 outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" type="password" id="password" name="password" value={regFormData.password} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="mt-6">
                            <button className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" type="submit">Register</button>
                        </div>
                    </form>
                </div>
            </div> */}


}

export default Register