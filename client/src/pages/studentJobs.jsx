import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [resume, setResume] = useState({});
  const [appliedJobs, setAppliedJobs] = useState({});

  // ✅ Fetch all jobs
  const fetchJobs = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/protected/jobs",
      { withCredentials: true }
    );

    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ Apply for job
  const handleApply = async (jobId) => {
    if (!resume) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("resume", resume);

    try {
      await axios.post(
        "http://localhost:5000/api/protected/apply",
        formData,
        { withCredentials: true }
      );

      alert("✅ Applied successfully");

      setAppliedJobs((prev) => ({
        ...prev,
        [jobId]: true
      }));

      setResume(null);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">

      <h2 className="font-bold text-lg mb-3">Available Jobs</h2>

      {jobs.map((job) => (
        <div key={job._id} className="border p-3 mb-3">

          <h3 className="font-semibold">{job.title}</h3>

          <p className="text-gray-600">{job.description}</p>

          {/* ✅ Upload Resume */}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="mt-2"
          />

          {/* ✅ Apply button */}
          <button
            onClick={() => handleApply(job._id)}
            disabled={appliedJobs[job._id]}
            className={`px-4 py-2 mt-2 rounded ${
              appliedJobs[job._id]
                ? "bg-gray-400"
                : "bg-green-500 text-white"
            }`}
          >
            {appliedJobs[job._id] ? "Applied ✅" : "Apply"}
          </button>

        </div>
      ))}

      {jobs.length === 0 && (
        <p>No jobs available</p>
      )}

    </div>
  );
}

export default StudentJobs;
