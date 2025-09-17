import React, { useState, useEffect } from "react";
import { createPoll } from "../api";
import { useNavigate } from "react-router-dom";
import { initSocket } from "../socket";

export const CreateQuestions = () => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
    ]);
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);

    // Initialize teacher socket
    useEffect(() => {
        const socket = initSocket({ role: "teacher" });
        console.log("🧑‍🏫 Teacher socket initialized:", socket.id);
    }, []);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const handleCorrectChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].isCorrect = value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        if (options.length < 4) {
            setOptions([...options, { text: "", isCorrect: false }]);
        }
    };

    const handleAskQuestion = async () => {
        const filledOptions = options.filter((opt) => opt.text.trim() !== "");
        if (!question.trim() || filledOptions.length < 2) {
            alert("Please enter a question and at least 2 options.");
            return;
        }

        try {
            setLoading(true);
            const payload = { question, options: filledOptions, duration: timer };
            let { data } = await createPoll(payload);
            console.log("✅ Poll created:", data);
            alert("Poll successfully sent to backend!");

            // Reset form
            setQuestion("");
            setOptions([
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
            ]);
            setTimer(60);

            navigate(`/poll/${data.poll.id}`);
        } catch (error) {
            console.error("❌ Error creating poll:", error);
            alert("Failed to send poll. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-start items-center py-10 px-4 bg-gray-50">
            {/* Header */}
            <h5 className="inline-flex mb-8 px-8 py-3 rounded-[24px] items-center justify-center gap-[7px] text-white font-bold text-xl shadow-lg
                bg-gradient-to-r from-[#8F64E1] via-[#8F64E1] to-[#1D68BD]
                hover:opacity-90 transition">
                ✨Intervue Poll
            </h5>

            <h2 className="text-3xl mb-6 text-center font-semibold">
                Let’s <span className="font-bold">Get Started</span>
            </h2>
            <p className="text-center mb-8 text-lg max-w-2xl text-gray-700">
                Create and manage polls, ask questions, and monitor responses in real-time.
            </p>

            {/* Question Input */}
            <div className="w-full max-w-3xl mb-6 p-6 bg-white rounded-2xl shadow-lg space-y-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Enter your question</h3>
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-gray-500 font-medium">Timer:</span>
                        <select
                            value={timer}
                            onChange={(e) => setTimer(parseInt(e.target.value))}
                            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                        >
                            {[30, 45, 60, 90, 120].map((sec) => (
                                <option key={sec} value={sec}>
                                    {sec} seconds
                                </option>
                            ))}
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="Type your question here..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="border p-3 rounded-xl w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                    />
                </div>

                {/* Options */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold mb-2">Options</h3>
                    <div className="grid grid-cols-2 gap-4 items-center font-semibold text-gray-700">
                        <div>Option</div>
                        <div>Is it Correct?</div>
                    </div>

                    {options.map((opt, idx) => (
                        <div key={idx} className="grid grid-cols-2 gap-4 items-center mt-2">
                            <input
                                type="text"
                                placeholder={`Option ${idx + 1}`}
                                value={opt.text}
                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                className="border p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                            />
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name={`correct-${idx}`}
                                        checked={opt.isCorrect === true}
                                        onChange={() => handleCorrectChange(idx, true)}
                                        className="accent-blue-500"
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name={`correct-${idx}`}
                                        checked={opt.isCorrect === false}
                                        onChange={() => handleCorrectChange(idx, false)}
                                        className="accent-blue-500"
                                    />
                                    No
                                </label>
                            </div>
                        </div>
                    ))}

                    {options.length < 4 && (
                        <button
                            onClick={handleAddOption}
                            className="px-5 py-2 mt-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold transition"
                        >
                            Add More Option
                        </button>
                    )}
                </div>

                {/* Submit Button */}
                <div className="text-center mt-6">
                    <button
                        onClick={handleAskQuestion}
                        disabled={loading}
                        className="w-full px-6 py-3 rounded-[24px] text-white font-bold text-lg shadow-lg
                            bg-gradient-to-r from-[#8F64E1] via-[#8F64E1] to-[#1D68BD]
                            hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Ask Question"}
                    </button>
                </div>
            </div>
        </div>
    );
};
