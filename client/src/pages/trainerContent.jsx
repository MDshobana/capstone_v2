import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import StudentAssignment from "./studentUpload";
import TrainerSubmissions from "./trainerupload";
import AIAssistant from "./aiComponents";
import StudentJobs from "./studentJobs";



export function TrainerContent() {
    const [user, setUser] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState({});

    const thumbnailRef = useRef(null);
    const videoRef = useRef(null);

    const [course, setCourse] = useState({
        title: "",
        description: "",
        category: "",
        level: ""
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [video, setVideo] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get('https://capstone-v2-xbv3.onrender.com/api/auth/checklogin', { withCredentials: true }).then(res => {
            setUser(res.data.user);
        }).catch(error => {
            console.error('Error fetching protected data:', error.response?.data || error.message);
        });
    }, []);



    useEffect(() => {
        axios.get("https://capstone-v2-xbv3.onrender.com/api/protected/courses", {
            withCredentials: true
        })
            .then(res => {
                setCourses(res.data);
            })
            .catch(err => console.log(err));
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await axios.put("https://capstone-v2-xbv3.onrender.com/api/protected/courses/" + editingId, course, { withCredentials: true });
            alert("Course updated successfully ✅");
            setEditingId(null);

            setCourse({
                title: "",
                description: "",
                category: "",
                level: ""
            });
            setThumbnail(null);
            setVideo(null);
        } else {

            const formData = new FormData();

            formData.append("title", course.title);
            formData.append("description", course.description);
            formData.append("category", course.category);
            formData.append("level", course.level);
            formData.append("thumbnail", thumbnail);
            formData.append("video", video);

            try {
                const res = await axios.post(
                    "https://capstone-v2-xbv3.onrender.com/api/protected/courses/upload",
                    formData,
                    { withCredentials: true }
                );

                console.log(res.data);
                alert("Course uploaded successfully ✅");


                setCourse({
                    title: "",
                    description: "",
                    category: "",
                    level: ""
                });
                setThumbnail(null);
                setVideo(null);

                thumbnailRef.current.value = null;
                videoRef.current.value = null;

                const updatedCourses = await axios.get(
                    "https://capstone-v2-xbv3.onrender.com/api/protected/courses",
                    { withCredentials: true }
                );

                setCourses(updatedCourses.data);

            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleRemoveCourse = async (courseId) => {

        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;

        try {
            await axios.delete("https://capstone-v2-xbv3.onrender.com/api/protected/courses/" + courseId, { withCredentials: true });
            console.log("Course removed successfully ✅");

            const updatedCourses = await axios.get(
                "https://capstone-v2-xbv3.onrender.com/api/protected/courses",
                { withCredentials: true }
            );
            setCourses(updatedCourses.data);

            setThumbnail(null);
            setVideo(null);

            thumbnailRef.current.value = null;
            videoRef.current.value = null;

        } catch (err) {
            console.error("Error removing course:", err);
        }
    };

    const handleEditCourse = async (course) => {
        setEditingId(course._id);
        setCourse({
            title: course.title,
            description: course.description,
            category: course.category,
            level: course.level
        });
    };


    const handleEnroll = async (courseId) => {
        if (!window.confirm("Proceed to fake payment (€10)?")) return;

        try {
            await axios.post(
                "https://capstone-v2-xbv3.onrender.com/api/protected/enroll",
                { courseId },
                { withCredentials: true }
            );

            console.log(res.data);


            setEnrolledCourses(prev => ({
                ...prev,
                [String(courseId)]: true
            }));

        } catch (err) {

            if (err.response?.data?.message === "Already enrolled") {

                setEnrolledCourses(prev => ({
                    ...prev,
                    [String(courseId)]: true
                }));

            } else {
                console.error(err);
            }

        }
    };



    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>

            <main>
                <div className="space-y-6">

                    {user.role === "admin" || user.role === "trainer" ? (
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mt-6 space-y-4">

                            <h2 className="text-xl font-bold">
                                {editingId ? "Edit Course" : "Create Course "}</h2>
                            <input
                                type="text"
                                placeholder="Title"
                                value={course.title}
                                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                                className="w-full border p-2 rounded"
                            />

                            <textarea
                                placeholder="Description"
                                value={course.description}
                                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                                className="w-full border p-2 rounded"
                            />

                            <input
                                type="text"
                                placeholder="Category"
                                value={course.category}
                                onChange={(e) => setCourse({ ...course, category: e.target.value })}
                                className="w-full border p-2 rounded"
                            />

                            <input
                                type="text"
                                placeholder="Level"
                                value={course.level}
                                onChange={(e) => setCourse({ ...course, level: e.target.value })}
                                className="w-full border p-2 rounded"
                            />

                            {/* ✅ Thumbnail Upload */}
                            <input
                                ref={thumbnailRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => setThumbnail(e.target.files[0])}
                            />

                            {/* ✅ Video Upload */}
                            <input
                                ref={videoRef}
                                type="file"
                                accept="video/*"
                                onChange={(e) => setVideo(e.target.files[0])}
                            />

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                {editingId ? "Edit Course" : "Upload Course"}
                            </button>

                        </form>) : (
                        <h3>Hello Student</h3>

                    )}
                </div>
                <div className="mt-10 space-y-6">

                <StudentJobs />

                    {courses.map(course => (

                        <div
                            key={course._id}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                        >

                            {/* ✅ LEFT SIDE (Assignments / Submissions) */}
                            <div className="lg:col-span-2">

                                <div className="bg-gray-50 border p-4 rounded">

                                    <h3 className="font-bold mb-2">
                                        {user.role === "trainer"
                                            ? `Submissions for ${course.title}`
                                            : `Assignments for ${course.title}`
                                        }
                                    </h3>

                                    {user.role === "student" && (
                                        <>
                                            <StudentAssignment
                                                courseId={course._id}
                                                assignments={["Assignment 1", "Assignment 2", "Assignment 3"]}
                                            />

                                        </>

                                    )}

                                    {(user.role === "trainer" || user.role === "admin") && (
                                        <TrainerSubmissions courseId={course._id} />
                                    )}

                                </div>



                            </div>

                            {/* ✅ RIGHT SIDE (Course Card) */}
                            <div className="border rounded-lg overflow-hidden shadow bg-white">

                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-40 object-cover"
                                />

                                <div className="p-4">

                                    <h3 className="text-lg font-bold">{course.title}</h3>

                                    <p className="text-sm text-gray-600 mt-1">
                                        {course.category} • {course.level}
                                    </p>

                                    {user.role === "student" && !enrolledCourses[course._id] ? (
                                        <div className="bg-gray-200 h-40 flex items-center justify-center rounded mt-3">
                                            <p className="text-gray-600">🔒 Enroll to watch</p>
                                        </div>
                                    ) : (
                                        <video controls className="mt-3 w-full rounded">
                                            <source src={course.video} controls className="mt-3 w-full rounded" type="video/mp4" />
                                        </video>
                                    )}

                                    {user.role === "admin" || user.role === "trainer" ? (
                                        <>
                                            <button
                                                onClick={() => handleRemoveCourse(course._id)}
                                                className="bg-red-500 text-white px-3 py-2 mt-4 rounded w-full"
                                            >
                                                Delete
                                            </button>

                                            <button
                                                onClick={() => handleEditCourse(course)}
                                                className="bg-yellow-500 text-white px-3 py-2 mt-2 rounded w-full"
                                            >
                                                Edit
                                            </button>
                                        </>
                                    ) : user.role === "student" && !enrolledCourses[course._id] ? (
                                        <button
                                            onClick={() => handleEnroll(course._id)}
                                            className="bg-green-500 text-white px-3 py-2 mt-4 rounded w-full"
                                        >
                                            Enroll
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="bg-gray-400 text-white px-3 py-2 mt-4 rounded w-full"
                                        >
                                            Enrolled ✅
                                        </button>
                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>
                {user.role === "student" && (
                        <div className="mb-6">
                            <AIAssistant />
                        </div>
                    )}

                {courses.length === 0 && <p>No courses available</p>}

            </main>
        </div>
    );
}

export default TrainerContent;



