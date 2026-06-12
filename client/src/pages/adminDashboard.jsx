import axios from "axios";
import React, { useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import TrainerContent from "./trainerContent";
import AdminAnalytics from "../components/adminAnalytics";
import { ActivityLog, RevenueReport } from "../components/adminAnalytics";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [manageUser, setManageUser] = useState([]);

    // ✅ Get logged-in user
    useEffect(() => {
        axios.get(`${API_URL}/api/auth/checklogin`, { withCredentials: true })
            .then(res => setUser(res.data.user))
            .catch(err => {
                console.error(err);
                setUser(null);
            });
    }, []);

    // ✅ Get all users (admin only)
    useEffect(() => {
        if (!user) return;

        if (user.role !== "admin") {
            alert("Access denied");
            return;
        }

        axios.get(`${API_URL}/api/protected/admin/manage-users`, { withCredentials: true })
            .then(res => setManageUser(res.data))
            .catch(err => console.error(err));
    }, [user]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex">

            {/* ✅ SIDEBAR */}
            <SideBar />

            {/* ✅ MAIN CONTENT */}
            <div className="ml-64 w-full bg-gray-100 min-h-screen p-8 space-y-10">

                {/* ✅ DASHBOARD HEADER */}
                <section id="dashboard">
                    <h1 className="text-3xl font-bold text-gray-800">
                        🛠️ Admin Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Welcome, {user.email}
                    </p>
                </section>
                {user.role?.toLowerCase() === "admin" && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Admin Dashboard 📊</h2>

                    <AdminAnalytics />
                    <ActivityLog />
                    <RevenueReport />
                </div>
            )}
                {/* ✅ USERS MANAGEMENT */}
                <section id="users" className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">👥 Manage Users</h2>

                    <ul className="divide-y divide-gray-200">
                        {manageUser.length > 0 ? (
                            manageUser.map(u => (
                                <li
                                    key={u._id}
                                    className="flex justify-between items-center py-4 hover:bg-gray-50 px-3 rounded-lg transition"
                                >
                                    {/* LEFT */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                            {u.email[0].toUpperCase()}
                                        </div>

                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {u.email}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                User account
                                            </p>
                                        </div>
                                    </div>

                                    {/* RIGHT */}
                                    <span className={`px-3 py-1 text-sm rounded-full font-medium capitalize
                                        ${u.role === "admin" && "bg-red-100 text-red-600"}
                                        ${u.role === "trainer" && "bg-blue-100 text-blue-600"}
                                        ${u.role === "student" && "bg-green-100 text-green-600"}
                                        ${u.role === "company" && "bg-purple-100 text-purple-600"}
                                    `}>
                                        {u.role}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="text-center py-4 text-gray-500">
                                No users found
                            </li>
                        )}
                    </ul>
                </section>

                {/* ✅ COURSES */}
                <section id="courses" className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">📚 Courses</h2>
                    <TrainerContent />
                </section>

                {/* ✅ CONTACT */}
                <section id="contact" className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">📞 Contact</h2>
                    <p className="text-gray-600">support@mylearning.com</p>
                </section>

            </div>
        </div>
    );
}


// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import NavBar from "../components/navBar";
// import TrainerContent from "./TrainerContent";

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// export function AdminDashboard() {
//     const [user, setUser] = useState("");
//     const [manageUser, setManageUser] = useState([]);

//     useEffect(() => {
//         axios.get(`${API_URL}/api/auth/checklogin`, { withCredentials: true })
//             .then(res => {
//                 setUser(res.data.user);
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//     }, []);

//     useEffect(() => {
//         if (!user) return;

//         if (user.role !== "admin") {
//             alert("Access denied");
//             return;
//         }

//         axios.get(`${API_URL}/api/protected/admin/manage-users`, { withCredentials: true })
//             .then(res => {
//                 setManageUser(res.data);
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//     }, [user]);

//     if (!user) {
//         return <p>Loading...</p>;
//     }

//     return (
//         <div className="bg-gray-100 min-h-screen">

//             <NavBar />

//             <main className="max-w-7xl mx-auto px-4 py-8">

//                 {/* ✅ DASHBOARD */}
//                 <section id="dashboard" className="mb-10">
//                     <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
//                     <p className="text-gray-600 mt-1">
//                         Welcome, {user.email} | Role: {user.role}
//                     </p>
//                 </section>

//                 {/* ✅ USERS */}
//                 <section className="bg-white rounded-xl shadow-md p-6 mb-10">
//                     <h2 className="text-xl font-semibold mb-4">Manage Users</h2>

//                     <ul className="divide-y divide-gray-200">
//                         {manageUser.length > 0 ? (
//                             manageUser.map(u => (
//                                 <li key={u._id}
//                                     className="flex justify-between items-center py-4 hover:bg-gray-50 px-3 rounded-lg">
                                    
//                                     <div className="flex items-center gap-4">
//                                         <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white">
//                                             {u.email[0].toUpperCase()}
//                                         </div>
//                                         <div>
//                                             <p className="font-medium">{u.email}</p>
//                                             <p className="text-sm text-gray-500">User account</p>
//                                         </div>
//                                     </div>

//                                     <span className={`px-3 py-1 text-sm rounded-full
//                                         ${u.role === "admin" && "bg-red-100 text-red-600"}
//                                         ${u.role === "trainer" && "bg-blue-100 text-blue-600"}
//                                         ${u.role === "student" && "bg-green-100 text-green-600"}
//                                         ${u.role === "company" && "bg-purple-100 text-purple-600"}
//                                     `}>
//                                         {u.role}
//                                     </span>

//                                 </li>
//                             ))
//                         ) : (
//                             <li className="text-center py-4">No users found</li>
//                         )}
//                     </ul>
//                 </section>

//                 {/* ✅ COURSES */}
//                 <section id="courses" className="bg-white rounded-xl shadow-md p-6 mb-10">
//                     <h2 className="text-xl font-semibold mb-4">Courses</h2>
//                     <TrainerContent />
//                 </section>

//                 {/* ✅ CONTACT */}
//                 <section id="contact" className="bg-white rounded-xl shadow-md p-6">
//                     <h2 className="text-xl font-semibold mb-4">Contact</h2>
//                     <p>Email: support@mylearning.com</p>
//                 </section>

//             </main>
//         </div>
//     );
// }
