
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Header from "../components/Header";

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// export function CompanyDashboard() {
//     const [user, setUser] = useState(null);
//     const [selectedJobId, setSelectedJobId] = useState(null);

//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");

//     const [jobs, setJobs] = useState([]);
//     const [applications, setApplications] = useState([]);

//     // ✅ Fetch user
//     useEffect(() => {
//         axios
//             .get(`${API_URL}/api/auth/checklogin`, {
//                 withCredentials: true,
//             })
//             .then((res) => {
//                 setUser(res.data.user);
//             });
//     }, []);

//     // ✅ Fetch jobs
//     const fetchJobs = async () => {
//         const res = await axios.get(
//             `${API_URL}/api/protected/company/jobs`,
//             { withCredentials: true }
//         );
//         setJobs(res.data);
//     };

//     // ✅ Fetch applications for a job
//     const fetchApplications = async (jobId) => {
//         setSelectedJobId(jobId);
//         const res = await axios.get(
//             `${API_URL}/api/protected/applications/${jobId}`,
//             { withCredentials: true }
//         );

//         setApplications(res.data);
//         console.log(res.data);
//     };

//     useEffect(() => {
//         if (user) fetchJobs();
//     }, [user]);

//     // ✅ Post job
//     const handlePostJob = async () => {
//         try {
//             await axios.post(
//                 `${API_URL}/api/protected/jobs`,
//                 { title, description },
//                 { withCredentials: true }
//             );

//             alert("✅ Job Posted");

//             setTitle("");
//             setDescription("");
//             fetchJobs();

//         } catch (err) {
//             console.error(err);
//         }
//     };

//     // ✅ Shortlist
//     const shortlist = async (id) => {
//         await axios.put(
//             `${API_URL}/api/protected/shortlist/${id}`,
//             {},
//             { withCredentials: true }
//         );

//         alert("✅ Shortlisted");


//         if (selectedJobId) {
//             fetchApplications(selectedJobId);
//         }

//     };

//     if (!user) {
//         return <p>Loading...</p>;
//     }

//     return (
//         <div>
//             <Header email={user.email} role={user.role} />

//             {/* ✅ POST JOB */}
//             <div className="p-4 bg-white shadow rounded mt-4">
//                 <h3 className="font-bold mb-2">Post Job</h3>

//                 <input
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="Job Title"
//                     className="border p-2 w-full mb-2"
//                 />

//                 <textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     placeholder="Description"
//                     className="border p-2 w-full mb-2"
//                 />

//                 <button
//                     onClick={handlePostJob}
//                     className="bg-blue-500 text-white px-4 py-2 rounded"
//                 >
//                     Post Job
//                 </button>
//             </div>

//             {/* ✅ JOB LIST */}
//             <div className="mt-6">
//                 <h3 className="font-bold">Your Jobs</h3>

//                 {jobs.map((job) => (
//                     <div key={job._id} className="border p-3 mt-3">

//                         <h4 className="font-semibold">{job.title}</h4>

//                         <button
//                             onClick={() => fetchApplications(job._id)}
//                             className="bg-gray-500 text-white px-3 py-1 mt-2 rounded"
//                         >
//                             View Applications
//                         </button>

//                     </div>
//                 ))}
//             </div>

//             {/* ✅ APPLICATIONS */}
//             <h3 className="font-bold">View Applications</h3>
//             {applications.length > 0 ? (
//                 applications.map((app) => (
//                     <div key={app._id} className="border p-3 mt-3">

//                         <p>{app.email}</p>

//                         <a
//                             href={`${API_URL}/${app.resumeUrl}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-500 underline"
//                         >
//                             Download Resume
//                         </a>

//                         <button
//                             onClick={() => shortlist(app._id)}
//                             className="bg-green-500 text-white px-3 py-1 mt-2 ml-3 rounded"
//                         >
//                             Shortlist
//                         </button>

//                     </div>
//                 ))
//             ) : (
//                 <h3>No applications found</h3>
//             )}

//         </div>
//     );
// }

// export default CompanyDashboard;

import axios from "axios";
import React, { useEffect, useState } from "react";
import SideBar from "../components/sideBar";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export function CompanyDashboard() {
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // ✅ Fetch user
    useEffect(() => {
        axios.get(`${API_URL}/api/auth/checklogin`, { withCredentials: true })
            .then(res => setUser(res.data.user))
            .catch(() => setUser(null));
    }, []);

    // ✅ Fetch jobs
    const fetchJobs = async () => {
        const res = await axios.get(`${API_URL}/api/protected/company/jobs`, {
            withCredentials: true
        });
        setJobs(res.data);
    };

    // ✅ Fetch applications
    const fetchApplications = async (jobId) => {
        setSelectedJobId(jobId);

        const res = await axios.get(
            `${API_URL}/api/protected/applications/${jobId}`,
            { withCredentials: true }
        );

        setApplications(res.data);
    };

    useEffect(() => {
        if (user) fetchJobs();
    }, [user]);

    // ✅ Post job
    const handlePostJob = async () => {
        if (!title || !description) {
            alert("Please fill all fields");
            return;
        }

        await axios.post(
            `${API_URL}/api/protected/jobs`,
            { title, description },
            { withCredentials: true }
        );

        alert("✅ Job Posted");

        setTitle("");
        setDescription("");

        fetchJobs();
    };

    // ✅ Shortlist
    const shortlist = async (id) => {
        await axios.put(
            `${API_URL}/api/protected/shortlist/${id}`,
            {},
            { withCredentials: true }
        );

        alert("✅ Candidate Shortlisted");

        if (selectedJobId) {
            fetchApplications(selectedJobId);
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="flex">

            {/* ✅ SIDEBAR */}
            <SideBar />

            {/* ✅ MAIN CONTENT */}
            <div className="ml-64 w-full bg-gray-100 min-h-screen p-8 space-y-10">

                {/* ✅ DASHBOARD */}
                <section id="dashboard">
                    <h1 className="text-3xl font-bold text-gray-800">
                        🏢 Company Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Welcome, {user.email}
                    </p>
                </section>

                {/* ✅ POST JOB */}
                <section id="jobs" className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">📢 Post Job</h2>

                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Job Title"
                        className="border p-2 w-full mb-3 rounded"
                    />

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        className="border p-2 w-full mb-3 rounded"
                    />

                    <button
                        onClick={handlePostJob}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Post Job
                    </button>
                </section>

                {/* ✅ JOB LIST */}
                <section className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">💼 Your Jobs</h2>

                    {jobs.length > 0 ? (
                        jobs.map(job => (
                            <div key={job._id} className="border rounded-lg p-4 mb-3 flex justify-between items-center">

                                <div>
                                    <h3 className="font-semibold text-lg">{job.title}</h3>
                                    <p className="text-sm text-gray-500">{job.description}</p>
                                </div>

                                <button
                                    onClick={() => fetchApplications(job._id)}
                                    className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
                                >
                                    View Applications
                                </button>

                            </div>
                        ))
                    ) : (
                        <p>No jobs posted yet</p>
                    )}
                </section>

                {/* ✅ APPLICATIONS */}
                <section id="applications" className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">📂 Applications</h2>

                    {applications.length > 0 ? (
                        applications.map(app => (
                            <div key={app._id}
                                className="border rounded-lg p-4 mb-3 flex justify-between items-center"
                            >

                                <div>
                                    <p className="font-medium">{app.email}</p>

                                    <a
                                        href={app.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline text-sm"
                                    >
                                        Download Resume
                                    </a>
                                </div>

                                <button
                                    onClick={() => shortlist(app._id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                    Shortlist
                                </button>

                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No applications found</p>
                    )}
                </section>

                {/* ✅ CONTACT */}
                <section id="contact" className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">📞 Contact</h2>
                    <p>Email: support@mylearning.com</p>
                </section>

            </div>
        </div>
    );
}

export default CompanyDashboard;
``
