import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRef } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function StudentAssignment({ courseId, assignments = [] }) {
  const [file, setFile] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const fileRef = useRef(null);
  const [downloadCertificate, setDownloadCertificate] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quiz, setQuiz] = useState(null);



  // ✅ Submit handler (with assignment name)
  const handleSubmit = async (assignment) => {
    const selectedFile = file[assignment];
    if (!selectedFile) {
      alert("Please select file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("courseId", courseId);
    formData.append("assignmentName", assignment);

    try {
      await axios.post(
        `${API_URL}/api/protected/submit-assignment`,
        formData,
        {
          withCredentials: true,

          headers: {
            "Content-Type": "multipart/form-data",
          },

        }
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
        `${API_URL}/api/protected/quiz/${courseId}`,
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
      `${API_URL}/api/protected/my-submissions`,
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
        `${API_URL}/api/protected/submit-quiz`,
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
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 space-y-6">

      {/* ✅ ASSIGNMENTS */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          📄 Assignments
        </h2>

        {assignments.map((assignment, index) => {
          const isSubmitted = submissions.some(
            sub => String(sub.assignmentName) === String(assignment)
          );

          return (
            <div
              key={index}
              className="bg-gray-50 border rounded-lg p-4 mb-3 hover:shadow-sm transition"
            >
              <p className="font-semibold">{assignment}</p>

              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(prev =>({...prev, [assignment]: e.target.files[0]}))}
                disabled={isSubmitted}
                className="mt-2 text-sm"
              />

              <button
                onClick={() => handleSubmit(assignment)}
                disabled={isSubmitted}
                className={`mt-3 px-4 py-2 rounded-lg text-white transition
                  ${isSubmitted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {isSubmitted ? "Submitted ✅" : "Submit"}
              </button>

              {/* ✅ Marks */}
              {isSubmitted && (
                <div>
                  <p className="mt-2 text-sm text-gray-600">
                    Marks: {
                      submissions.find(sub => sub.assignmentName === assignment)?.marks || "Pending"
                    }
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Feedback: {
                      submissions.find(sub => sub.assignmentName === assignment)?.feedback || ""
                    }
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ✅ QUIZ */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          🧠 Quiz
        </h2>

        {quiz && quiz.questions ? (
          quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="border rounded-lg p-4 mb-4 bg-gray-50">

              <p className="font-semibold mb-2">{q.question}</p>

              {q.options.map((opt, optIndex) => (
                <button
                  key={optIndex}
                  onClick={() => {
                    const updated = [...answers];
                    updated[qIndex] = opt;
                    setAnswers(updated);
                  }}
                  className={`block w-full text-left mt-2 px-3 py-2 border rounded transition
                    ${answers[qIndex] === opt
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No quiz available</p>
        )}

        {quiz && (
          <button
            onClick={handleSubmitQuiz}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg mt-3 hover:bg-purple-700"
          >
            Submit Quiz
          </button>
        )}
      </div>

      {/* ✅ CERTIFICATE */}
      {downloadCertificate && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="font-semibold text-green-700">
            🎉 Congratulations! You passed the quiz
          </p>

          <a
            href={`${API_URL}/api/protected/certificate/${courseId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mt-2 block"
          >
            Download Certificate 🎓
          </a>
        </div>
      )}
    </div>
  );




}

export default StudentAssignment;