import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initSocket } from "../socket";

export const EnterName = () => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleContinue = () => {
        if (!name.trim()) return;
        setLoading(true);

        // establish socket connection with student name
        initSocket(name);
    };

    useEffect(() => {
        let timer;
        if (loading) {
            timer = setTimeout(() => {
                navigate("/questions", { state: { userName: name } });
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [loading, navigate, name]);

    return (
        <div className="text-center mt-10">
            <h5 className="text-xl mb-4">✨Intervue Poll</h5>

            {!loading ? (
                <>
                    <h2 className="text-2xl mb-2">
                        Let’s <span className="font-bold">Get Started</span>
                    </h2>
                    <p className="mb-4">
                        If you’re a student, you’ll be able to{" "}
                        <span className="font-semibold">submit your answers</span>, participate in live polls,
                        and see how your responses compare with your classmates
                    </p>
                    <p className="mb-2">Please enter your name to continue</p>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="px-3 py-2 rounded border mb-4"
                    />
                    <br />
                    <button
                        onClick={handleContinue}
                        className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                        Continue
                    </button>
                </>
            ) : (
                <div className="mt-10">
                    <div className="border-4 border-gray-300 border-t-blue-500 rounded-full w-10 h-10 mx-auto mb-4 animate-spin"></div>
                    <p>Wait for the teacher to ask questions..</p>
                </div>
            )}
        </div>
    );
};
