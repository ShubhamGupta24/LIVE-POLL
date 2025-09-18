import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSocket } from "../socket";
import { fetchPollById, endPoll } from "../api";
import { FaQuestionCircle } from "react-icons/fa";
import TimerImage from "../assets/Timer.png";

export const PollPreview = () => {
    const navigate = useNavigate();
    const { pollId } = useParams();
    const [poll, setPoll] = useState(null);
    const [timer, setTimer] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // Fetch poll details
    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const { data } = await fetchPollById(pollId);
                setPoll(data.poll);
                setTimer(data.poll.duration);
                console.log("✅ Fetched poll:", data.poll);
            } catch (err) {
                console.error("❌ Error fetching poll:", err);
            }
        };
        fetchPoll();
    }, [pollId]);

    // Socket listeners for live updates
    useEffect(() => {
        const socket = getSocket();

        const handleUpdate = (updatedPoll) => {
            if (updatedPoll.id === pollId) {
                console.log("🔄 Poll updated:", updatedPoll);
                setPoll(updatedPoll);
            }
        };

        const handleEnd = (endedPoll) => {
            if (endedPoll.id === pollId) {
                console.log("⏹ Poll ended:", endedPoll);
                setPoll(endedPoll);
                setSubmitted(true);
            }
        };

        socket.on("updatePoll", handleUpdate);
        socket.on("endPoll", handleEnd);

        return () => {
            socket.off("updatePoll", handleUpdate);
            socket.off("endPoll", handleEnd);
        };
    }, [pollId]);

    // Timer countdown & auto-end
    useEffect(() => {
        if (timer === null || submitted) return;

        const interval = setInterval(() => {
            setTimer((t) => {
                if (t <= 1) {
                    clearInterval(interval);
                    autoEndPoll();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        const autoEndPoll = async () => {
            try {
                const { data } = await endPoll(pollId);
                console.log("✅ Poll ended automatically:", data.poll);
                setPoll(data.poll);
                setSubmitted(true);
            } catch (err) {
                console.error("❌ Error ending poll:", err);
            }
        };

        return () => clearInterval(interval);
    }, [timer, submitted, pollId]);

    if (!poll) return <p>Loading poll...</p>;

    const totalVotes = poll.options.reduce((sum, o) => sum + (o.votes || 0), 0);

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-50">
            <h5 className="inline-flex mb-8 px-8 py-3 rounded-[24px] items-center justify-center gap-[7px] text-white font-bold text-xl shadow-lg
                bg-gradient-to-r from-[#8F64E1] via-[#8F64E1] to-[#1D68BD]
                hover:opacity-90 transition">
                ✨Intervue Poll
            </h5>

            {/* Question header */}
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-6">
                <div className="flex items-center gap-3 mb-3">
                    <FaQuestionCircle className="text-[#8F64E1]" size={24} />
                    <h3 className="text-lg font-semibold">Question</h3>
                    <div className="flex items-center text-red-500 font-bold ml-auto">
                        <img src={TimerImage} alt="Timer" className="w-10 h-10 inline-block" />
                        {!submitted && timer > 0 && (
                            <span className="ml-auto font-bold">00:{timer}s</span>
                        )}
                    </div>
                </div>

                <div className="mb-4 border border-[#AF8FF1] rounded-[10px] p-4">
                    <p
                        className="text-lg mb-4 font-medium text-white p-4 rounded-t-[10px] bg-gradient-to-r from-[#343434] to-[#6E6E6E]"
                    >
                        {poll.question}
                    </p>


                    {/* Options / Results */}
                    {!submitted ? (
                        <ul className="space-y-2">
                            {poll.options.map((option, i) => (
                                <li key={i}
                                    className={`mb-3 p-2 rounded-xl ${option.isCorrect ? "border-2" : ""}`}
                                    style={option.isCorrect ? { borderColor: "#7765DA" } : {}}>
                                    {option.text}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>
                            <h4 className="font-semibold mb-2">📊 Poll Results:</h4>
                            {poll.options.map((option, i) => {
                                const percentage =
                                    totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
                                return (
                                    <div key={i}
                                        className={`mb-3 p-2 rounded-xl ${option.isCorrect ? "border-2" : ""}`}
                                        style={option.isCorrect ? { borderColor: "#7765DA" } : {}}>
                                        <div className="flex justify-between mb-1">

                                        </div>
                                        <div className="bg-gray-300 rounded-full h-5 overflow-hidden">
                                            <div
                                                className="[background:linear-gradient(99.18deg,#8F64E1_-46.89%,#1D68BD_223.45%)] h-5 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            ><span>{option.text}</span>
                                                <span className="font-semibold">{percentage}%</span></div>
                                        </div>
                                    </div>
                                );
                            })}

                            <button
                                className="fixed bottom-6 right-6 px-6 py-2 rounded-lg text-white font-semibold 
                            [background:linear-gradient(99.18deg,#8F64E1_-46.89%,#1D68BD_223.45%)]
                            hover:opacity-90 transition"
                                onClick={() => navigate("/createQuestions")}
                            >
                                + Ask a new question
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};
