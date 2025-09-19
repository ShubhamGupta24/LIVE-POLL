import React, { useState, useEffect } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import TimerImage from "../assets/Timer.png";
import { getSocket } from "../socket";
import { fetchActivePoll, submitVote } from "../api";
import Countdown from "./Countdown";

export const Questions = () => {
    const socket = getSocket();
    const [poll, setPoll] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    // Load active poll and set up socket listener
    useEffect(() => {
        const loadPoll = async () => {
            try {
                const res = await fetchActivePoll();
                const latestPoll = res.data.poll;
                if (latestPoll) {
                    setPoll(latestPoll);

                    // only set timer if not already running
                    if (timeLeft === null) {
                        setTimeLeft(latestPoll.duration);
                    }
                }
            } catch (err) {
                console.error("Error fetching poll:", err);
            }
        };

        loadPoll();
    }, [timeLeft]);

    useEffect(() => {

        const handleUpdate = (updatedPoll) => {
            if (poll && updatedPoll.id === poll.id) {
                setPoll(prev => ({ ...prev, options: updatedPoll.options })); // replace poll to trigger re-render
            }
        };

        const handleNewPoll = (newPoll) => {
            setPoll(newPoll);
            setTimeLeft(newPoll.duration);
            setSubmitted(false);
            setSelectedOption("");
        };

        socket.on("updatePoll", handleUpdate);
        socket.on("newPoll", handleNewPoll);

        return () => {
            socket.off("updatePoll", handleUpdate);
            socket.off("newPoll", handleNewPoll);
        };
    }, [poll, socket]);


    // ✅ Handle poll end
    const handlePollEnd = () => {
        console.log("⏱️ Countdown finished → Ending poll in UI");
        setSubmitted(true);
        setTimeLeft(0);
    };

    // Submit vote
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

    const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);

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
                    <div className="flex items-center text-red-500 font-bold ml-auto">
                        <img src={TimerImage} alt="Timer" className="w-10 h-10" />
                        {!submitted && timeLeft > 0 && (
                            <Countdown duration={timeLeft} onComplete={() => setSubmitted(true)} />
                        )}
                    </div>
                </div>
                <div className="mb-4 border border-[#AF8FF1] rounded-[10px]">
                    <p
                        className="text-lg mb-4 font-medium text-white p-4 rounded-t-[10px] bg-gradient-to-r from-[#343434] to-[#6E6E6E]"
                    >
                        {poll.question}
                    </p>


                    {!submitted && timeLeft > 0 ? (
                        <ul className="space-y-3">
                            {poll.options.map((option, i) => (
                                <li key={i}>
                                    <label className="flex items-center m-3 gap-3 cursor-pointer p-3 rounded-xl border hover:bg-gray-100 transition">
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
                            <h4 className="font-semibold text-lg mb-3">📊 Poll Results:</h4>
                            {poll.options.map((option, i) => {
                                const percentage =
                                    totalVotes > 0
                                        ? ((option.votes / totalVotes) * 100).toFixed(1)
                                        : 0;

                                return (
                                    <div
                                        key={i}
                                        className={`m-3 rounded-xl overflow-hidden relative text-white ${option.isCorrect ? "border-2 border-[#7765DA]" : ""
                                            }`}
                                    >
                                        {/* Gradient bar or light gray for low/0% */}
                                        <div
                                            className="flex justify-between items-center px-3 py-3 relative z-10 text-lg font-medium rounded-xl"
                                            style={{
                                                width: percentage > 0 ? `${percentage}%` : "100%",
                                                background:
                                                    percentage > 0
                                                        ? "linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%)"
                                                        : "#E5E5E5", // light gray for 0% or very low
                                                color: percentage > 0 ? "#FFFFFF" : "#555555", // text contrast
                                            }}
                                        >
                                            <span>{option.text}</span>
                                            <span>{percentage}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}


                </div>
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

                {/* Timer expired message */}
                {!submitted && timeLeft === 0 && (
                    <p className="mt-4 font-bold text-red-500 text-center text-lg">Time's up! Poll ended.</p>
                )}
            </div>
        </div >
    );
};
