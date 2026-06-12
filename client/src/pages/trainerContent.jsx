import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import StudentAssignment from "./studentUpload";
import TrainerSubmissions from "./trainerupload";
import AIAssistant from "./aiComponents";
import StudentJobs from "./studentJobs";




const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function TrainerContent() {
    const [user, setUser] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState({});

    const thumbnailRef = useRef(null);
    const videoRef = useRef(null);

    const [course, setCourse] = useState({
        title: "",
        description: "",
        category: "",
        level: "",
        price: 100
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [video, setVideo] = useState(null);

    // ✅ Get user
    useEffect(() => {
        axios.get(`${API_URL}/api/auth/checklogin`, { withCredentials: true })
            .then(res => setUser(res.data.user))
            .catch(() => setUser(null));
    }, []);

    // ✅ Get courses
    useEffect(() => {
        axios.get(`${API_URL}/api/protected/courses`, { withCredentials: true })
            .then(res => setCourses(res.data));
    }, []);


    useEffect(() => {
        const fetchEnrolled = async () => {
            const res = await axios.get(
                `${API_URL}/api/protected/enrolled-courses`,
                { withCredentials: true }
            );

            const enrolledMap = {};

            res.data.forEach(e => {
                enrolledMap[e.courseId] = true;
            });

            setEnrolledCourses(enrolledMap);
        };

        fetchEnrolled();
    }, []);


    // ✅ Submit Course
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingId) {
            await axios.put(`${API_URL}/api/protected/courses/${editingId}`, course, { withCredentials: true });

            alert("Updated ✅");
            setEditingId(null);
        } else {
            const formData = new FormData();
            formData.append("title", course.title);
            formData.append("description", course.description);
            formData.append("category", course.category);
            formData.append("level", course.level);
            formData.append("thumbnail", thumbnail);
            formData.append("video", video);
            formData.append("price", course.price);

            await axios.post(`${API_URL}/api/protected/courses/upload`, formData, {
                withCredentials: true
            });

            alert("Uploaded ✅");
        }

        resetForm();
        fetchCourses();
    };

    const fetchCourses = async () => {
        const res = await axios.get(`${API_URL}/api/protected/courses`, { withCredentials: true });
        setCourses(res.data);
    };

    const resetForm = () => {
        setCourse({ title: "", description: "", category: "", level: "" });
        setThumbnail(null);
        setVideo(null);
        thumbnailRef.current && (thumbnailRef.current.value = null);
        videoRef.current && (videoRef.current.value = null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete course?")) return;

        await axios.delete(`${API_URL}/api/protected/courses/${id}`, {
            withCredentials: true
        });

        fetchCourses();
    };

    const handleEdit = (c) => {
        setEditingId(c._id);
        setCourse(c);
    };

    const handlePayment = async (course) => {
        try {
            const res = await axios.post(
                `${API_URL}/api/protected/create-order`,
                {
                    amount: course.price,
                    courseId: course._id
                },
                { withCredentials: true }
            );

            const options = {
                key: "rzp_test_xxxxx",
                amount: res.data.amount,
                currency: "INR",
                name: "SkillSphere",
                description: course.title,
                order_id: res.data.id,

                handler: async function (response) {
                    alert("✅ Payment successful");

                    // ✅ enroll user here
                    await axios.post(`${API_URL}/api/protected/enroll`, {
                        courseId: course._id,
                        paymentId: response.razorpay_payment_id
                    });
                }
            };
            setEnrolledCourses(prev => ({ ...prev, [course._id]: true }));
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {

            console.error("Payment error:", err);
            alert("Payment failed ❌");

        }


    };


    if (!user) return <p>Loading...</p>;

    return (
        <div className="space-y-10">

            {/* ✅ Welcome */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h2 className="text-lg font-semibold">Welcome 👋</h2>
                <p className="text-sm text-gray-600">
                    Explore courses, Quizz and assignments
                </p>
            </div>
            
            {/* ✅ JOBS */}
            {user.role?.toLowerCase() === "student" ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Jobs</h2>
                    <StudentJobs />
                </div>
            ) : null}


            {/* ✅ Upload Form (Admin/Trainer only) */}
            {(user.role === "admin" || user.role === "trainer") && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
                    <h2 className="text-xl font-bold">
                        {editingId ? "Edit Course" : "Create Course"}
                    </h2>

                    <input
                        placeholder="Title"
                        value={course.title}
                        onChange={e => setCourse({ ...course, title: e.target.value })}
                        className="w-full border p-2 rounded"
                    />

                    <textarea
                        placeholder="Description"
                        value={course.description}
                        onChange={e => setCourse({ ...course, description: e.target.value })}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        placeholder="Category"
                        value={course.category}
                        onChange={e => setCourse({ ...course, category: e.target.value })}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        placeholder="Level"
                        value={course.level}
                        onChange={e => setCourse({ ...course, level: e.target.value })}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={course.price || ""}
                        onChange={e => setCourse({ ...course, price: e.target.value })}
                        className="w-full border p-2 rounded"
                    />


                    <input ref={thumbnailRef} type="file" onChange={e => setThumbnail(e.target.files[0])} />
                    <input ref={videoRef} type="file" onChange={e => setVideo(e.target.files[0])} />

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        {editingId ? "Update" : "Upload"}
                    </button>
                </form>
            )}

            {/* ✅ COURSES */}
            <div className="grid gap-8">
                {courses.map(course => (
                    <div key={course._id} className="grid lg:grid-cols-3 gap-6">

                        {/* ✅ Assignments */}
                        <div className="lg:col-span-2 bg-gray-50 p-4 rounded">
                            <h3 className="font-bold mb-2">{course.title} Assignments</h3>

                            {user.role === "student" && (
                                <StudentAssignment courseId={course._id} assignments={["A1", "A2", "A3"]} />
                            )}

                            {(user.role === "trainer" || user.role === "admin") && (
                                <TrainerSubmissions courseId={course._id} />
                            )}
                        </div>

                        {/* ✅ Course Card */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <img src={course.thumbnail} className="h-40 w-full object-cover" />

                            <div className="p-4">
                                <h3 className="font-bold text-lg">{course.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {course.category} • {course.level}
                                </p>

                                {user.role === "student" && !enrolledCourses[course._id] ? (
                                    <div className="bg-gray-200 h-40 flex items-center justify-center mt-3 rounded">
                                        🔒 Enroll to watch
                                    </div>
                                ) : (
                                    <video controls className="mt-3 w-full rounded">
                                        <source src={course.video} type="video/mp4" />
                                    </video>
                                )}

                                {/* ✅ Actions */}
                                {(user.role === "admin" || user.role === "trainer") ? (
                                    <>
                                        <button onClick={() => handleDelete(course._id)}
                                            className="bg-red-500 w-full mt-3 py-2 rounded text-white">
                                            Delete
                                        </button>

                                        <button onClick={() => handleEdit(course)}
                                            className="bg-yellow-500 w-full mt-2 py-2 rounded text-white">
                                            Edit
                                        </button>
                                    </>
                                ) : (
                                    !enrolledCourses[course._id] ? (
                                        <button
                                            onClick={() => handlePayment(course)}
                                            className="bg-green-500 w-full mt-3 py-2 rounded text-white"
                                        >
                                            Buy / Enroll
                                        </button>
                                    ) : (
                                        <button disabled className="bg-gray-400 w-full mt-3 py-2 rounded text-white">
                                            Enrolled ✅
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* ✅ AI Assistant */}
            {user.role?.toLowerCase() === "student" && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <AIAssistant />
                </div>
            )}

            {courses.length === 0 && <p>No courses available</p>}
        </div>
    );
}

