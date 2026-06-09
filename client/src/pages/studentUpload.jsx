import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRef } from "react";

function StudentAssignment({ courseId, assignments = [] }) {
  const [file, setFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const fileRef = useRef(null);
  const [downloadCertificate, setDownloadCertificate] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quiz, setQuiz] = useState(null);



  // ✅ Submit handler (with assignment name)
  const handleSubmit = async (assignment) => {

    if (!file) {
      alert("Please select file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);
    formData.append("assignmentName", assignment);

    try {
      await axios.post(
        "http://localhost:5000/api/protected/submit-assignment",
        formData,
        { withCredentials: true }
      );

      alert("✅ Submitted");
      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = null;
      }

      setSubmissions(prev => [
        ...prev,
        {
          courseId,
          assignmentName: assignment,
          marks: null
        }
      ]);

      // fetchSubmission();

    } catch (err) {
      console.error("ERROR RESPONSE:", err.response?.data);
    }
  };


  const fetchQuiz = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/protected/quiz/${courseId}`,
        { withCredentials: true }
      );

      setQuiz(res.data);

    } catch (err) {
      console.error("No quiz found");
    }
  };

  // ✅ Fetch submissions
  const fetchSubmission = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/protected/my-submissions",
      { withCredentials: true }
    );

    const filtered = res.data.filter(
      sub => sub.courseId === courseId
    );

    setSubmissions(filtered);
  };


  useEffect(() => {
    fetchSubmission();
    fetchQuiz();

  }, [courseId]);



  const handleSubmitQuiz = async () => {



    try {
      const res = await axios.post(
        "http://localhost:5000/api/protected/submit-quiz",
        {
          courseId,
          answers
        },
        { withCredentials: true }
      );

      alert(`✅ Your score: ${res.data.score}`);

      if (res.data.passed) {
        setDownloadCertificate(true);
      } else {
        alert("❌ You did not pass the quiz");
      }

    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="bg-white p-6 rounded shadow mt-6">

      <h2 className="text-xl font-bold mb-4">Submit Assignments</h2>

      {/* ✅ Loop over assignments */}
      {assignments.map((assignment, index) => {

        const isSubmitted = submissions.some(
          sub => String(sub.assignmentName) === String(assignment)
        );

        return (
          <div key={index} className="border p-3 mt-3 rounded">

            <p className="font-semibold">{assignment}</p>

            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={isSubmitted}
            />

            <button
              onClick={() => handleSubmit(assignment)}
              disabled={isSubmitted}
              className={`px-4 py-2 mt-2 rounded ${isSubmitted
                ? "bg-gray-400"
                : "bg-blue-500 text-white"
                }`}
            >
              {isSubmitted ? "Submitted ✅" : "Submit"}
            </button>

            {/* ✅ Show result */}
            {isSubmitted && (
              <div className="mt-2 text-sm">
                Marks: {
                  submissions.find(
                    sub => sub.assignmentName === assignment
                  )?.marks || "Pending"
                }
              </div>
            )}

          </div>
        );
      })}
      <h2 className="text-xl font-bold mt-6 mb-4">
        Take Test
      </h2>

      {/* ✅ If quiz exists */}
      {quiz && quiz.questions ? (
        <div>

          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="border p-3 mb-3 rounded">

              {/* ✅ Question */}
              <p className="font-semibold">{q.question}</p>

              {/* ✅ Options */}
              {q.options.map((opt, optIndex) => (
                <button
                  key={optIndex}
                  onClick={() => {
                    const updated = [...answers];
                    updated[qIndex] = opt;
                    setAnswers(updated);
                  }}
                  className={`block mt-2 px-3 py-1 border rounded ${answers[qIndex] === opt
                    ? "bg-blue-500 text-white"
                    : ""
                    }`}
                >
                  {opt}
                </button>
              ))}

            </div>
          ))}

          {/* ✅ Submit Quiz */}
          <button
            onClick={() => handleSubmitQuiz(courseId, answers)}
            className="bg-purple-500 text-white px-4 py-2 rounded mt-3"
          >
            Submit Quiz
          </button>

        </div>
      ) : (
        <p>No quiz available for this course</p>
      )}
      {downloadCertificate && (

        <a
          href={`http://localhost:5000/api/protected/certificate/${courseId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-blue-600 underline"
        >
          🎓 Download Certificate
        </a>

      )}
    </div>
  );
}

export default StudentAssignment;