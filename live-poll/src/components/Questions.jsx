import React, { useState, useEffect } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import TimerImage from "../assets/Timer.png";
import { getSocket } from "../socket";
import { fetchActivePoll, submitVote } from "../api";

export const Questions = () => {
    const socket = getSocket();
    const [poll, setPoll] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    // Load poll & setup socket
    useEffect(() => {
        const loadPoll = async () => {
            try {
                const res = await fetchActivePoll();
                const latestPoll = res.data.poll;
                if (latestPoll) {
                    setPoll(latestPoll);
                    setTimeLeft(latestPoll.duration);
                }
            } catch (err) {
                console.error("Error fetching poll:", err);
            }
        };

        loadPoll();

        socket.on("updatePoll", (updatedPoll) => {
            setPoll((prev) => (prev && updatedPoll.id === prev.id ? updatedPoll : prev));
        });

        socket.on("endPoll", (endedPoll) => {
            setPoll((prev) => (prev && endedPoll.id === prev.id ? endedPoll : prev));
            setSubmitted(true);
        });

        return () => {
            socket.off("updatePoll");
            socket.off("endPoll");
        };
    }, []);

    // Timer countdown
    useEffect(() => {
        if (!poll || submitted || timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [poll, timeLeft, submitted]);

    const handleSubmit = async () => {
        if (!selectedOption || !poll) return;
        const optionIndex = poll.options.findIndex((opt) => opt.text === selectedOption);
        if (optionIndex === -1) return;
        try {
            await submitVote({ pollId: poll.id, optionIndex });
            setSubmitted(true);
        } catch (err) {
            console.error("Vote submit failed:", err);
        }
    };

    if (!poll) return <p className="text-center mt-10 text-lg font-medium">Loading poll...</p>;

    const totalVotes = poll.votes ? poll.votes.reduce((a, b) => a + b, 0) : 0;

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-50">
            {/* Header */}
            <h5 className="inline-flex mb-8 px-8 py-3 rounded-[24px] items-center justify-center gap-[7px] text-white font-bold text-xl shadow-lg
                bg-gradient-to-r from-[#8F64E1] via-[#8F64E1] to-[#1D68BD]
                hover:opacity-90 transition">
                ✨Intervue Poll
            </h5>

            {/* Question Card */}
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <FaQuestionCircle className="text-[#8F64E1]" size={26} />
                    <h3 className="text-xl font-semibold">Question</h3>
                    <div className="flex items-center text-red-500 font-bold">
                        <img src={TimerImage} alt="Timer" className="w-10 h-10" />
                        {!submitted && timeLeft > 0 && (
                            <span className="ml-auto font-bold text-lg">00:{timeLeft}s</span>
                        )}</div>
                </div>

                <p className="text-lg mb-4 font-medium">{poll.question}</p>

                {/* Options */}
                {!submitted && timeLeft > 0 ? (
                    <ul className="space-y-3">
                        {poll.options.map((option, i) => (
                            <li key={i}>
                                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border hover:bg-gray-100 transition">
                                    <input
                                        type="radio"
                                        name="poll-options"
                                        value={option.text}
                                        checked={selectedOption === option.text}
                                        onChange={() => setSelectedOption(option.text)}
                                        className="accent-[#8F64E1]"
                                    />
                                    <span className="text-lg font-medium">{option.text}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>
                        <h4 className="font-semibold text-lg mb-3">Poll Results:</h4>
                        {poll.options.map((option, i) => {
                            const percentage =
                                totalVotes > 0 ? ((poll.votes[i] / totalVotes) * 100).toFixed(1) : 0;
                            return (
                                <div key={i} className="mb-3">
                                    <div className="flex justify-between mb-1 text-lg font-medium">
                                        <span>{option.text}</span>
                                        <span>{percentage}%</span>
                                    </div>
                                    <div className="bg-gray-300 h-5 rounded-full">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${percentage}%`,
                                                background: "linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%)",
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Submit button */}
                {!submitted && timeLeft > 0 && (
                    <button
                        onClick={handleSubmit}
                        className="w-full px-6 py-3 rounded-[24px] text-white font-bold text-lg shadow-lg
                            bg-gradient-to-r from-[#8F64E1] via-[#8F64E1] to-[#1D68BD]
                            hover:opacity-90 transition disabled:opacity-50 mt-4"
                    >
                        Submit
                    </button>
                )}

                {/* Time's up */}
                {!submitted && timeLeft === 0 && (
                    <p className="mt-4 font-bold text-red-500 text-center text-lg">Time's up! Poll ended.</p>
                )}
            </div>
        </div>
    );
};
