
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import NavBar from '../components/navBar';
// import TrainerContent from "./TrainerContent";

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// export function StudentDashboard() {
//     const [user, setUser] = useState("");

//     useEffect(() => {
//         axios.get(`${API_URL}/api/auth/checklogin`, { withCredentials: true })
//             .then(res => {
//                 setUser(res.data.user);
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//     }, []);

//     if (!user) {
//         return <p className="text-center mt-10">Loading...</p>;
//     }

//     return (
//         <div className="bg-gray-100 min-h-screen">
//             <NavBar />

//             <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">

//                 {/* ✅ DASHBOARD */}
//                 <section id="dashboard">
//                     <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
//                     <p className="text-gray-600 mt-1">
//                         Welcome, {user.email}
//                     </p>
//                 </section>

//                 {/* ✅ COURSES */}
//                 <section id="courses" className="bg-white rounded-xl shadow-md p-6">
//                     <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
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

import axios from "axios";
import React, { useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import TrainerContent from "./TrainerContent";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export function StudentDashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${API_URL}/api/auth/checklogin`, { withCredentials: true })
            .then(res => setUser(res.data.user))
            .catch(err => {
                console.error(err);
                setUser(null);
            });
    }, []);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex">

            {/* ✅ LEFT SIDEBAR */}
            <SideBar />

            {/* ✅ RIGHT CONTENT */}
            <div className="ml-64 w-full bg-gray-100 min-h-screen p-8 space-y-10">

                {/* ✅ DASHBOARD SECTION */}
                <section id="dashboard">
                    <h1 className="text-3xl font-bold text-gray-800">
                        🎓 Student Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Welcome, {user.email}
                    </p>
                </section>

                {/* ✅ COURSES SECTION */}
                <section id="courses" className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        📚 Your Courses
                    </h2>
                    <TrainerContent />
                </section>

                {/* ✅ CONTACT SECTION */}
                <section id="contact" className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        📞 Contact
                    </h2>
                    <p className="text-gray-600">
                        Email: support@mylearning.com
                    </p>
                </section>

            </div>

        </div>
    );
}
