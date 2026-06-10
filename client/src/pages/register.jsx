import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NavBar from '../components/navBar';


function Register() {
    const [regFormData, setregFormData] = useState({
        firstName: '',
        lastName: '',
        age: 0,
        email: '',
        password: '',
        role: 'student'

    })



    const handleChange = (e) => {
        setregFormData({ ...regFormData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://api.mylearningportal.site/api/auth/register', regFormData);

        } catch (error) {
            console.log("An error occured during registeration:", error.response?.data || error.message);
        };
    }
    return (
        <>

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
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
            </div>
        </>
    )
}

export default Register