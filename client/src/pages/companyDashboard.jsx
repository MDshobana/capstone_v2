
import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../components/header";

export function CompanyDashboard() {
    const [user, setUser] = useState(null);
    const [selectedJobId, setSelectedJobId] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    // ✅ Fetch user
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/auth/checklogin", {
                withCredentials: true,
            })
            .then((res) => {
                setUser(res.data.user);
            });
    }, []);

    // ✅ Fetch jobs
    const fetchJobs = async () => {
        const res = await axios.get(
            "http://localhost:5000/api/protected/company/jobs",
            { withCredentials: true }
        );
        setJobs(res.data);
    };

    // ✅ Fetch applications for a job
    const fetchApplications = async (jobId) => {
        setSelectedJobId(jobId);
        const res = await axios.get(
            `http://localhost:5000/api/protected/applications/${jobId}`,
            { withCredentials: true }
        );

        setApplications(res.data);
        console.log(res.data);
    };

    useEffect(() => {
        if (user) fetchJobs();
    }, [user]);

    // ✅ Post job
    const handlePostJob = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/protected/jobs",
                { title, description },
                { withCredentials: true }
            );

            alert("✅ Job Posted");

            setTitle("");
            setDescription("");
            fetchJobs();

        } catch (err) {
            console.error(err);
        }
    };

    // ✅ Shortlist
    const shortlist = async (id) => {
        await axios.put(
            `http://localhost:5000/api/protected/shortlist/${id}`,
            {},
            { withCredentials: true }
        );

        alert("✅ Shortlisted");


        if (selectedJobId) {
            fetchApplications(selectedJobId);
        }

    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Header email={user.email} role={user.role} />

            {/* ✅ POST JOB */}
            <div className="p-4 bg-white shadow rounded mt-4">
                <h3 className="font-bold mb-2">Post Job</h3>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Job Title"
                    className="border p-2 w-full mb-2"
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="border p-2 w-full mb-2"
                />

                <button
                    onClick={handlePostJob}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Post Job
                </button>
            </div>

            {/* ✅ JOB LIST */}
            <div className="mt-6">
                <h3 className="font-bold">Your Jobs</h3>

                {jobs.map((job) => (
                    <div key={job._id} className="border p-3 mt-3">

                        <h4 className="font-semibold">{job.title}</h4>

                        <button
                            onClick={() => fetchApplications(job._id)}
                            className="bg-gray-500 text-white px-3 py-1 mt-2 rounded"
                        >
                            View Applications
                        </button>

                    </div>
                ))}
            </div>

            {/* ✅ APPLICATIONS */}
            <h3 className="font-bold">View Applications</h3>
            {applications.length > 0 ? (
                applications.map((app) => (
                    <div key={app._id} className="border p-3 mt-3">

                        <p>{app.email}</p>

                        <a
                            href={`http://localhost:5000/${app.resumeUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            Download Resume
                        </a>

                        <button
                            onClick={() => shortlist(app._id)}
                            className="bg-green-500 text-white px-3 py-1 mt-2 ml-3 rounded"
                        >
                            Shortlist
                        </button>

                    </div>
                ))
            ) : (
                <h3>No applications found</h3>
            )}

        </div>
    );
}

export default CompanyDashboard;
