import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function AIAssistant() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        try {
            const res = await axios.post(
                `${API_URL}/api/protected/chat`,
                { message: input },
                { withCredentials: true }
            );

            setResponse(res.data.reply);
        } catch (err) {

            console.error(err);
            setResponse("❌ Something went wrong");

        }
        finally {
            setLoading(false);
        }};

        return (
            <div className="p-4 border rounded bg-white">

                <h2 className="font-bold text-lg">AI Assistant 🤖</h2>

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full border p-2 mt-2"
                />

                <button
                    onClick={handleAsk}
                    className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                >
                   {loading ? "Thinking..." : "Ask AI"}
                </button>


                <div className="flex flex-wrap gap-2 mt-3">
                    <button onClick={() => setInput("Generate React interview questions")}>
                        React Questions
                    </button>

                    <button onClick={() => setInput("Explain JWT Authentication")}>
                        JWT Explanation
                    </button>

                    <button onClick={() => setInput("Improve my resume summary")}>
                        Resume Help
                    </button>
                </div>

                {/* ✅ Response */}
                {response && (
                    <div className="mt-4 p-3 bg-gray-100 rounded">
                        {response}
                    </div>
                )}
            </div>
        );
    }

    export default AIAssistant;