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

    // Socket listeners
    useEffect(() => {
        const socket = getSocket();

        socket.on("updatePoll", (updatedPoll) => {
            if (poll && updatedPoll.id === poll.id) {
                console.log("🔄 Poll updated:", updatedPoll);
                setPoll(updatedPoll);
            }
        });

        socket.on("endPoll", (endedPoll) => {
            if (poll && endedPoll.id === poll.id) {
                console.log("⏹ Poll ended:", endedPoll);
                setPoll(endedPoll);
                setSubmitted(true);
            }
        });

        return () => {
            socket.off("updatePoll");
            socket.off("endPoll");
        };
    }, [poll]);

    // Timer (display only)
    useEffect(() => {
        if (timer === null || submitted) return;

        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((t) => t - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer, submitted]);

    // Manual end poll handler
    const handleEndPoll = async () => {
        try {
            await endPoll(pollId);
            console.log("✅ Poll manually ended");
            setSubmitted(true);
        } catch (err) {
            console.error("❌ Error ending poll:", err);
        }
    };

    if (!poll) return <p>Loading poll...</p>;

    const totalVotes = poll.options.reduce(
        (sum, option) => sum + (option.votes || 0),
        0
    );

    return (
        <div className="p-5 max-w-md mx-auto">
            <h5 className="text-xl mb-2">✨Intervue Poll</h5>

            {/* Question header */}
            <div className="flex items-center gap-3 mb-3">
                <FaQuestionCircle className="text-blue-500" size={24} />
                <h3 className="text-lg font-semibold">Question</h3>
                <img src={TimerImage} alt="Timer" className="w-10 h-10 inline-block" />
                {!submitted && timer > 0 && (
                    <span className="ml-auto font-bold">{timer}s</span>
                )}
            </div>

            <p className="mb-4">{poll.question}</p>

            {/* Options / Results */}
            {!submitted ? (
                <div>
                    <ul className="space-y-2">
                        {poll.options.map((option, i) => (
                            <li key={i} className="p-2 border rounded bg-gray-100">
                                {option.text}
                            </li>
                        ))}
                    </ul>

                    {/* End Poll Button */}
                    <button
                        className="mt-6 w-full px-6 py-2 rounded-lg text-white font-semibold 
                            [background:linear-gradient(99.18deg,#E16464_-46.89%,#BD1D1D_223.45%)]
                            hover:opacity-90 transition"
                        onClick={handleEndPoll}
                    >
                        ⏹ End Poll
                    </button>
                </div>
            ) : (
                <div>
                    <h4 className="font-semibold mb-2">📊 Poll Results:</h4>
                    {poll.options.map((option, i) => {
                        const percentage =
                            totalVotes > 0
                                ? ((option.votes / totalVotes) * 100).toFixed(1)
                                : 0;
                        return (
                            <div key={i} className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <span>{option.text}</span>
                                    <span className="font-semibold">{percentage}%</span>
                                </div>
                                <div className="bg-gray-300 rounded-full h-5 overflow-hidden">
                                    <div
                                        className="[background:linear-gradient(99.18deg,#8F64E1_-46.89%,#1D68BD_223.45%)] h-5 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
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
    );
};
