import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function SideBar() {
    const navigate = useNavigate();

    const logout = async () => {
        await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
        navigate("/login");
    };

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="w-64 h-screen bg-gray-900 text-white p-6 fixed">

            <h1 className="text-2xl font-bold text-yellow-400 mb-10">
                MyLearning
            </h1>

            <ul className="space-y-6 text-lg">

                <li
                    onClick={() => scrollTo("dashboard")}
                    className="cursor-pointer hover:text-yellow-400"
                >
                    Dashboard
                </li>

                <li
                    onClick={() => scrollTo("courses")}
                    className="cursor-pointer hover:text-yellow-400"
                >
                    Courses
                </li>

                <li
                    onClick={() => scrollTo("jobs")}
                    className="cursor-pointer hover:text-yellow-400"
                >
                    Jobs
                </li>

                {/* <li onClick={() => scrollTo("jobs")}> Jobs</li> */}
                <li onClick={() => scrollTo("applications")}
                    className="cursor-pointer hover:text-yellow-400"> Applications</li>


                <li
                    onClick={() => scrollTo("contact")}
                    className="cursor-pointer hover:text-yellow-400"
                >
                    Contact
                </li>

                <li
                    onClick={logout}
                    className="cursor-pointer text-red-400 hover:text-red-500 mt-10"
                >
                    Logout
                </li>

            </ul>
        </div>
    );
}