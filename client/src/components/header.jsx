import { useState } from "react";
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    
    const handleLogOut =async() => {
        try{
            await axios.post(`${API_URL}/api/auth/logout`, {}, {withCredentials: true})
            console.log("loggedout successfully")
            navigate('/login');
        }catch(error) {
            console.log("Error while logout")
        }
    };
    return (
        <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
            <h1 className="font-bold text-yellow-400 text-lg">MyLearning</h1>

            <nav className="flex gap-6 items-center">


                <a href="#dashboard" onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
                }}>
                    Dashboard
                </a>


                <a href="#courses" className="hover:text-yellow-400">
                    Courses
                </a>

                <a href="#contact" className="hover:text-yellow-400">
                    Contact
                </a>


                <button onClick={handleLogOut} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
                    Log Out
                </button>
            </nav>
        </header>
    );
}