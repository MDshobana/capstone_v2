import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [resume, setResume] = useState({});
  const [appliedJobs, setAppliedJobs] = useState({});

  // ✅ Fetch jobs
  const fetchJobs = async () => {
    const res = await axios.get(`${API_URL}/api/protected/jobs`, {
      withCredentials: true
    });
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ Apply
  const handleApply = async (jobId) => {
    const selectedResume = resume[jobId];
    if (!selectedResume) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("resume", selectedResume);

    try {
      await axios.post(`${API_URL}/api/protected/apply`, formData, {
        withCredentials: true
      });

      alert("✅ Applied successfully");

      setAppliedJobs(prev => ({
        ...prev,
        [jobId]: true
      }));

      setResume(null);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">

      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        💼 Available Jobs
      </h2>

      {jobs.length > 0 ? (
        jobs.map(job => (
          <div
            key={job._id}
            className="bg-gray-50 border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >

            {/* ✅ Job Info */}
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {job.description}
            </p>

            {/* ✅ Upload */}
            <input
              type="file"
              accept="application/pdf"

              onChange={(e) =>
                setResume(prev => ({
                  ...prev,
                  [job._id]: e.target.files[0]
                }))
              }

              className="mt-3 text-sm"
            />

            {/* ✅ Button */}
            <button
              onClick={() => handleApply(job._id)}
              disabled={appliedJobs[job._id]}
              className={`mt-3 w-full px-4 py-2 rounded-lg text-white transition
                ${appliedJobs[job._id]
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {appliedJobs[job._id] ? "Applied ✅" : "Apply"}
            </button>

          </div>
        ))
      ) : (
        <p className="text-gray-500">No jobs available</p>
      )}

    </div>
  );
}

export default StudentJobs;
