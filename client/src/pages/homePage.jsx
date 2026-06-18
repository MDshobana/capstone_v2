import React from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Layers, Code } from "lucide-react";

import course1 from "../assets/images/ai_course.png";
import course2 from "../assets/images/fsd.png";
import course3 from "../assets/images/python.png";


function Home() {
    const navigate = useNavigate();

    const courses = [
        {
            id: 1,
            title: "AI",
            level: "Beginner",
            icon: <Brain size={40} />

        },
        {
            id: 2,
            title: "Full stack development",
            level: "Beginner",
            icon: <Layers size={40} />

        },
        {
            id: 3,
            title: "Python",
            level: "Advanced",
            icon: <Code size={40} />

        },
    ]

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ✅ NAVBAR */}
            <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
                <h1 className="text-xl font-bold text-blue-600">
                    MyLearning Portal
                </h1>

                <div className="space-x-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="text-gray-600 hover:text-blue-600"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate("/register")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Register
                    </button>
                </div>
            </nav>


            {/* ✅ HERO SECTION */}
            <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <h2 className="text-4xl font-bold mb-4">
                    Learn. Build. Grow 🚀
                </h2>

                <p className="text-lg mb-6">
                    Explore courses, complete assignments, and get hired.
                </p>

                <button
                    onClick={() => navigate("/register")}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
                >
                    Get Started
                </button>
            </section>


            {/* ✅ FEATURES */}
            <section className="py-16 px-6 text-center">
                <h3 className="text-2xl font-bold mb-10">Why Choose Us</h3>

                <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">

                    <div className="bg-white p-6 rounded-xl shadow">
                        📚
                        <h4 className="font-semibold mt-2">Courses</h4>
                        <p className="text-sm text-gray-500">
                            Learn from curated content
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        📝
                        <h4 className="font-semibold mt-2">Assignments</h4>
                        <p className="text-sm text-gray-500">
                            Practice with real tasks
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        🤖
                        <h4 className="font-semibold mt-2">AI Mentor</h4>
                        <p className="text-sm text-gray-500">
                            Get instant help
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        💼
                        <h4 className="font-semibold mt-2">Jobs</h4>
                        <p className="text-sm text-gray-500">
                            Apply directly
                        </p>
                    </div>

                </div>
            </section>


            {/* ✅ COURSE PREVIEW */}
            <section className="py-16 px-6 bg-gray-100">
                <h3 className="text-2xl font-bold text-center mb-10">
                    Popular Courses
                </h3>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl shadow overflow-hidden">

                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 flex flex-col items-center justify-center h-40 text-white">
                                {course.icon}
                            </div>

                            <div className="p-4">
                                <h4 className="font-semibold">{course.title}</h4>
                                <p className="text-sm text-gray-500">{course.level}</p>
                            </div>

                        </div>
                    ))}

                </div>
            </section>


            {/* ✅ ROLE SECTION */}
            <section className="py-16 px-6 text-center">
                <h3 className="text-2xl font-bold mb-10">
                    Who is this for?
                </h3>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

                    <div className="p-6 bg-white rounded-xl shadow">
                        👨‍🎓
                        <h4 className="font-semibold mt-2">Students</h4>
                        <p className="text-sm text-gray-500">
                            Learn and apply for jobs
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow">
                        👩‍🏫
                        <h4 className="font-semibold mt-2">Trainers</h4>
                        <p className="text-sm text-gray-500">
                            Create and manage courses
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow">
                        🏢
                        <h4 className="font-semibold mt-2">Companies</h4>
                        <p className="text-sm text-gray-500">
                            Post jobs and hire talent
                        </p>
                    </div>

                </div>
            </section>


            {/* ✅ CTA */}
            <section className="text-center py-16 bg-blue-600 text-white">
                <h3 className="text-2xl font-bold mb-4">
                    Start your journey today 🚀
                </h3>

                <button
                    onClick={() => navigate("/register")}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold"
                >
                    Join Now
                </button>
            </section>


            {/* ✅ FOOTER */}
            {/* <Footer /> */}
            {/* <footer className="text-center py-6 text-gray-500">
                © 2026 MyLearning Portal
            </footer> */}

        </div>
    );
}

export default Home;