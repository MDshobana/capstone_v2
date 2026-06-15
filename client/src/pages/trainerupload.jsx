import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function TrainerSubmissions({ courseId }) {
    const [submissions, setSubmissions] = useState([]);
    const [openAssignment, setOpenAssignment] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [savedQuiz, setSavedQuiz] = useState(null);

    useEffect(() => {
        axios.get(
            `${API_URL}/api/protected/submissions/${courseId}`,
            { withCredentials: true }
        ).then(res => {
            setSubmissions(res.data);
        });
        fetchQuiz();
    }, []);

    const handleEvaluate = async (id, marks, feedback) => {
        await axios.put(
            `${API_URL}/api/protected/evaluate/${id}`,
            { marks, feedback },
            { withCredentials: true }
        );

        alert("✅ Evaluation saved");

        // ✅ refresh list
        const res = await axios.get(
            `${API_URL}/api/protected/submissions/${courseId}`,
            { withCredentials: true }
        );

        setSubmissions(res.data);
    };


    const groupedSubmissions = (submissions || []).reduce((acc, sub) => {


        const key = sub.assignmentName || "Unknown Assignment";


        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(sub);

        return acc;

    }, {});


    const handleAddQuestion = () => {
        setQuestions(prev => [
            ...prev,
            {
                question: "",
                options: ["", "", "", ""],
                correctAnswer: ""
            }
        ]);
    };

    const handleQuestionChange = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[optIndex] = value;
        setQuestions(updated);
    };


    const handleDeleteQuiz = async () => {
        if (!window.confirm("Delete this quiz?")) return;

        await axios.delete(`${API_URL}/api/protected/quiz/${courseId}`, {
            withCredentials: true
        });

        alert("Quiz deleted ✅");

        // ✅ clear UI
        setQuestions([]);
    };

    const handleSaveQuiz = async () => {

        if (!questions.length) {
            alert("Add at least one question");
            return;
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];

            if (!q.question.trim()) {
                alert(`Question ${i + 1} is empty ❌`);
                return;
            }

            if (!q.options || q.options.some(opt => !opt.trim())) {
                alert(`All options must be filled for Q${i + 1} ❌`);
                return;
            }

            if (!q.correctAnswer.trim()) {
                alert(`Correct answer missing for Q${i + 1} ❌`);
                return;
            }

            if (!q.options.includes(q.correctAnswer)) {
                alert(`Correct answer must match one option in Q${i + 1} ❌`);
                return;
            }
        }


        try {
            await axios.post(
                `${API_URL}/api/protected/quiz`,
                {
                    courseId,
                    questions
                },
                { withCredentials: true }
            );

            alert("✅ Quiz saved");
            setQuestions([]);
            fetchQuiz()
        } catch (err) {
            console.error(err);
        }
    };


    const fetchQuiz = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/api/protected/quiz/${courseId}`,
                { withCredentials: true }
            );

            setSavedQuiz(res.data);

        } catch (err) {
            console.log("No quiz available");
        }
    };


    return (
        <div className="space-y-6 mt-6">

            {/* ✅ ASSIGNMENTS GROUP */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    📥 Student Submissions
                </h2>

                {Object.keys(groupedSubmissions).length === 0 ? (
                    <p className="text-gray-500">No submissions available</p>
                ) : (

                    Object.keys(groupedSubmissions).map((assignment, index) => (
                        <div key={index} className="border rounded-xl shadow-sm bg-white overflow-hidden">

                            {/* ✅ HEADER */}
                            <div
                                onClick={() =>
                                    setOpenAssignment(
                                        openAssignment === assignment ? null : assignment
                                    )
                                }
                                className="cursor-pointer bg-gray-100 px-4 py-3 flex justify-between items-center hover:bg-gray-200 transition"
                            >
                                <span className="font-semibold">{assignment}</span>
                                <span>{openAssignment === assignment ? "▲" : "▼"}</span>
                            </div>

                            {/* ✅ CONTENT */}
                            {openAssignment === assignment && (
                                <div className="p-4 space-y-4">

                                    {(groupedSubmissions[assignment] || []).map(sub => (
                                        <div key={sub._id} className="border rounded-lg p-4 bg-gray-50">

                                            <p className="font-semibold text-gray-800">
                                                {sub?.userId?.email || "No email"}
                                            </p>

                                            <a
                                                href={sub.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline text-sm"
                                            >
                                                View Submission
                                            </a>

                                            <input
                                                type="number"
                                                placeholder="Marks"
                                                defaultValue={sub.marks || ""}
                                                onChange={(e) => sub.marks = e.target.value}
                                                className="border p-2 mt-3 w-full rounded"
                                            />

                                            <textarea
                                                placeholder="Feedback"
                                                defaultValue={sub.feedback || ""}
                                                onChange={(e) => sub.feedback = e.target.value}
                                                className="border p-2 mt-2 w-full rounded"
                                            />

                                            <button
                                                onClick={() =>
                                                    handleEvaluate(sub._id, sub.marks, sub.feedback)
                                                }
                                                className="bg-green-600 text-white px-4 py-2 mt-3 rounded-lg hover:bg-green-700 transition"
                                            >
                                                Save Evaluation ✅
                                            </button>

                                        </div>
                                    ))}

                                </div>
                            )}
                        </div>
                    )))}
            </div>

            {/* ✅ QUIZ BUILDER */}
            <div className="bg-white rounded-xl shadow-md p-6">

                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    🧠 Manage Quiz
                </h2>

                {/* ✅ Existing Quiz */}
                {savedQuiz && savedQuiz.questions && (
                    <div className="mb-6 bg-gray-50 p-4 rounded border">

                        <h3 className="font-semibold mb-3">Saved Quiz</h3>

                        {savedQuiz.questions.map((q, index) => (
                            <div key={index} className="mb-3">

                                <p className="font-medium">
                                    Q{index + 1}: {q.question}
                                </p>

                                <ul className="ml-4 list-disc text-sm">
                                    {q.options.map((opt, i) => (
                                        <li key={i}>
                                            {opt}
                                            {opt === q.correctAnswer && (
                                                <span className="text-green-600"> ✅</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {/* ✅ Add Question Button */}
                <button
                    onClick={handleAddQuestion}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-700"
                >
                    Add Question
                </button>

                {/* ✅ Question Form */}
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="border p-4 mb-4 rounded-lg bg-gray-50">

                        <input
                            type="text"
                            placeholder="Enter question"
                            value={q.question}
                            onChange={(e) =>
                                handleQuestionChange(qIndex, "question", e.target.value)
                            }
                            className="w-full border p-2 rounded mb-2"
                        />

                        {q.options.map((opt, optIndex) => (
                            <input
                                key={optIndex}
                                type="text"
                                placeholder={`Option ${optIndex + 1}`}
                                value={opt}
                                onChange={(e) =>
                                    handleOptionChange(qIndex, optIndex, e.target.value)
                                }
                                className="w-full border p-2 rounded mb-1"
                            />
                        ))}

                        <input
                            type="text"
                            placeholder="Correct Answer"
                            value={q.correctAnswer}
                            onChange={(e) =>
                                handleQuestionChange(qIndex, "correctAnswer", e.target.value)
                            }
                            className="w-full border p-2 rounded mt-2"
                        />

                    </div>
                ))}

                {/* ✅ Save Quiz */}
                {questions.length > 0 && (
                    <button
                        disabled={!questions.length}
                        onClick={handleSaveQuiz}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                    >
                        Save Quiz ✅
                    </button>
                )}

                <button
                    onClick={handleDeleteQuiz}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                >
                    Delete Quiz
                </button>


            </div>

        </div>
    );

}

export default TrainerSubmissions;