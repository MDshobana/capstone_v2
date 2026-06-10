import React, { useState, useEffect } from "react";
import axios from "axios";

function TrainerSubmissions({ courseId }) {
    const [submissions, setSubmissions] = useState([]);
    const [openAssignment, setOpenAssignment] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [savedQuiz, setSavedQuiz] = useState(null);

    useEffect(() => {
        axios.get(
            `https://api.mylearningportal.site/api/protected/submissions/${courseId}`,
            { withCredentials: true }
        ).then(res => {
            setSubmissions(res.data);
        });
        fetchQuiz();
    }, []);

    const handleEvaluate = async (id, marks, feedback) => {
        await axios.put(
            `https://api.mylearningportal.site/api/protected/evaluate/${id}`,
            { marks, feedback },
            { withCredentials: true }
        );

        alert("✅ Evaluation saved");

        // ✅ refresh list
        const res = await axios.get(
            `https://api.mylearningportal.site/api/protected/submissions/${courseId}`,
            { withCredentials: true }
        );

        setSubmissions(res.data);
    };


    const groupedSubmissions = submissions.reduce((acc, sub) => {


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

    const handleSaveQuiz = async () => {

        if (questions.length === 0) {
            alert("Add at least one question");
            return;
        }

        try {
            await axios.post(
                "https://api.mylearningportal.site/api/protected/quiz",
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
                `https://api.mylearningportal.site/api/protected/quiz/${courseId}`,
                { withCredentials: true }
            );

            setSavedQuiz(res.data);

        } catch (err) {
            console.log("No quiz available");
        }
    };


    return (
        <div className="mt-6">

            {Object.keys(groupedSubmissions).map((assignment, index) => (

                <div key={index} className="mb-4 border rounded">

                    {/* ✅ HEADER (click to expand) */}
                    <div
                        onClick={() =>
                            setOpenAssignment(
                                openAssignment === assignment ? null : assignment
                            )
                        }
                        className="cursor-pointer bg-gray-200 p-3 font-bold flex justify-between"
                    >
                        {assignment}

                        <span>
                            {openAssignment === assignment ? "▲" : "▼"}
                        </span>
                    </div>

                    {/* ✅ EXPAND SECTION */}
                    {openAssignment === assignment && (

                        <div className="p-4 space-y-4 bg-white">

                            {groupedSubmissions[assignment].map(sub => (

                                <div
                                    key={sub._id}
                                    className="border p-3 rounded"
                                >

                                    <p className="font-semibold">
                                        {sub.userId.email}
                                    </p>

                                    {/* ✅ FIX FILE URL */}
                                    <a
                                        href={sub.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        View PDF
                                    </a>

                                    <input
                                        type="number"
                                        placeholder="Marks"
                                        defaultValue={sub.marks || ""}
                                        onChange={(e) => sub.marks = e.target.value}
                                        className="border p-2 mt-2 w-full"
                                    />

                                    <textarea
                                        placeholder="Feedback"
                                        defaultValue={sub.feedback || ""}
                                        onChange={(e) => sub.feedback = e.target.value}
                                        className="border p-2 mt-2 w-full"
                                    />

                                    <button
                                        onClick={() =>
                                            handleEvaluate(sub._id, sub.marks, sub.feedback)
                                        }
                                        className="bg-green-500 text-white px-4 py-2 mt-3 rounded"
                                    >
                                        Save Evaluation
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            ))}
            <div>
                <div className="mt-6 bg-gray-50 p-4 rounded border">

                    <h3 className="text-lg font-bold mb-3">Add Test</h3>
                    {savedQuiz && savedQuiz.questions && (
                        <div className="mt-6 bg-white p-4 rounded border">

                            <h3 className="text-lg font-bold mb-3">
                                ✅ Saved Quiz
                            </h3>

                            {savedQuiz.questions.map((q, index) => (
                                <div key={index} className="mb-3">

                                    <p className="font-semibold">
                                        Q{index + 1}: {q.question}
                                    </p>

                                    <ul className="ml-4 list-disc">
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
                    <button
                        onClick={handleAddQuestion}
                        className="bg-blue-500 text-white px-3 py-1 rounded mb-4"
                    >
                        Add Question
                    </button>

                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="border p-3 mb-3 rounded bg-white">

                            {/* ✅ Question */}
                            <input
                                type="text"
                                placeholder="Enter question"
                                value={q.question}
                                onChange={(e) =>
                                    handleQuestionChange(qIndex, "question", e.target.value)
                                }
                                className="w-full border p-2 mb-2"
                            />

                            {/* ✅ Options */}
                            {q.options.map((opt, optIndex) => (
                                <input
                                    key={optIndex}
                                    type="text"
                                    placeholder={`Option ${optIndex + 1}`}
                                    value={opt}
                                    onChange={(e) =>
                                        handleOptionChange(qIndex, optIndex, e.target.value)
                                    }
                                    className="w-full border p-2 mb-1"
                                />
                            ))}

                            {/* ✅ Correct Answer */}
                            <input
                                type="text"
                                placeholder="Correct Answer"
                                value={q.correctAnswer}
                                onChange={(e) =>
                                    handleQuestionChange(qIndex, "correctAnswer", e.target.value)
                                }
                                className="w-full border p-2 mt-2"
                            />

                        </div>
                    ))}

                    {questions.length > 0 && (
                        <button
                            onClick={handleSaveQuiz}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Save Quiz ✅
                        </button>
                    )}

                </div>

            </div>

        </div>

    );
}

export default TrainerSubmissions;