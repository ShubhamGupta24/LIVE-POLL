import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const [role, setRole] = useState(""); // "student" or "teacher"
    const navigate = useNavigate();

    const handleContinue = () => {
        if (role === "student") {
            navigate("/enterName");
        } else if (role === "teacher") {
            navigate("/createQuestions");
        } else {
            alert("Please select a role to continue.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-10 bg-gray-50">
            {/* Header */}
            <h5 className="inline-flex mb-8 px-8 py-3 rounded-[24px] items-center justify-center gap-[7px] text-white font-bold text-xl shadow-lg
                bg-gradient-to-r from-[#8F64E1] via-[#8F64E1] to-[#1D68BD]
                hover:opacity-90 transition">
                ✨Intervue Poll
            </h5>

            <h2 className="text-3xl mb-6 text-center font-semibold">
                Welcome to the <span className="font-bold">Live Polling System</span>
            </h2>
            <p className="mb-8 text-center text-lg">
                Please select the role that best describes you to begin using the live polling system
            </p>

            {/* Role Selection */}
            <div className="flex w-full max-w-3xl gap-6 mb-8">
                <div
                    onClick={() => setRole("student")}
                    className={`flex-1 p-6 border rounded-xl cursor-pointer flex flex-col items-center justify-center text-center font-semibold 
                        ${role === "student" ? "border-blue-500 bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white shadow-lg" : "border-gray-300 bg-white text-gray-800"}`}
                >
                    <h1 className="text-xl md:text-2xl">I’m a Student</h1>
                    <p className="mt-2 text-base md:text-lg font-normal">Join as a student to participate in live polls</p>
                </div>

                <div
                    onClick={() => setRole("teacher")}
                    className={`flex-1 p-6 border rounded-xl cursor-pointer flex flex-col items-center justify-center text-center font-semibold
                        ${role === "teacher" ? "border-green-500 bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white shadow-lg" : "border-gray-300 bg-white text-gray-800"}`}
                >
                    <h1 className="text-xl md:text-2xl">I’m a Teacher</h1>
                    <p className="mt-2 text-base md:text-lg font-normal">Submit answers and view live poll results in real-time.</p>
                </div>
            </div>

            {/* Continue Button */}
            <button
                onClick={handleContinue}
                className="inline-flex px-8 py-3 rounded-[24px] text-white font-bold text-lg shadow-lg
                    bg-gradient-to-r from-[#8F64E1] via-[#8F64E1] to-[#1D68BD]
                    hover:opacity-90 transition"
            >
                Continue
            </button>
        </div>
    );
};
