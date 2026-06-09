import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './authContext';
import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


export default function NavBar() {
    const { user, setUser } = useContext(AuthContext);
    const useNavigated = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/auth/checklogin", { withCredentials: true }).then((response) => {
            setUser(response.data.user);
        }).catch((error) => {
            setUser(null);
            console.error("Error checking login status:", error);
        })
    }, []);

    const handleLogOut = () => {
        axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true }).then((response) => {
            console.log(response.data);
            setUser(null);
            useNavigated("/login");
        }).catch((error) => {
            console.error("Error during logout:", error);
        });
    }

    return (
        <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-md">

            <h1 className="text-2xl font-bold text-yellow-400">
                MyLearning
            </h1>
            {!user ?(
            <ul className="flex gap-8 items-center text-gray-200">

                <li className="hover:text-blue-400 cursor-pointer">Courses</li>
                <li className="hover:text-blue-400 cursor-pointer">Contact</li>

                <li>
                    <Link to="/login" className="hover:text-blue-400">
                        Login
                    </Link>
                </li>

                <li>
                    <Link
                        to="/"
                        className="bg-blue-500 px-4 py-1 rounded hover:bg-blue-600"
                    >
                        Sign Up
                    </Link>
                </li>

            </ul> ): (
                <ul className="flex gap-8 items-center text-gray-200">
                    <li className="hover:text-blue-400 cursor-pointer">Dashboard</li>
                    <li className="hover:text-blue-400 cursor-pointer">Courses</li>
                    <li className="hover:text-blue-400 cursor-pointer">Contact</li>
                    
                    <li>
                        <button
                            onClick={handleLogOut}
                            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
                        >
                            Log Out
                        </button>
                    </li>

                </ul>	
            )}
        </nav>
    );
}