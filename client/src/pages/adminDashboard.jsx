import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import Header from '../components/header';
import TrainerContent from "./trainerContent";

export function AdminDashboard() {
    const [user, setUser] = useState("");
    const [manageUser, setManageUser] = useState([]);
    useEffect(() => {
        axios.get('https://capstone-v2-xbv3.onrender.com/api/auth/checklogin', { withCredentials: true }).then(res => {
            setUser(res.data.user);
        }).catch(error => {
            console.error('Error fetching protected data:', error.response?.data || error.message);
        });
    }, []);

    useEffect(() => {
        if (!user) return;

        if (user.role !== "admin") {
            alert("Access denied");
            return;
        }

        axios.get('https://capstone-v2-xbv3.onrender.com/api/protected/admin/manage-users', { withCredentials: true }).then(res => {
            console.log(res.data);
            setManageUser(res.data);
        }).catch(error => {
            console.error('Error fetching admin data:', error.response?.data || error.message);
        });
    }, [user]);
    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {/* <header className="relative bg-gray-200 shadow-sm">
                <div div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p>Welcome, {user.email}!</p>
                    <p>Your role is: {user.role}</p>
                </div>
            </header> */}
            <Header email={user.email} role={user.role} />
            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
                    <ul className="divide-y divide-gray-200 bg-gray-200 rounded-lg shadow">
                        {manageUser.length > 0 ? (
                            manageUser.map(user => (

                                <li key={user._id} className="flex justify-between items-center px-4 py-4 hover:bg-gray-50">

                                    <div className="flex items-center gap-4">


                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                                            {user.email[0].toUpperCase()}
                                        </div>


                                        <div>

                                            <p className="font-medium text-gray-900">{user.email}</p>
                                            <p className="text-sm text-gray-500"> {user.email}</p>
                                        </div>
                                    </div>


                                    <div className="text-sm text-gray-600">
                                        {user.role}
                                    </div>

                                </li>
                            ))
                        ) : (

                            <li className="px-4 py-4 text-gray-500 text-center">
                                No users found.</li>)
                        }
                    </ul>
                </div>
                <TrainerContent />
            </main>
        </div>

    )
}

