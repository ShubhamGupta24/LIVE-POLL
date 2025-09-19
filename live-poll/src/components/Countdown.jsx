// Countdown.jsx
import React, { useEffect, useState } from "react";

const Countdown = ({ duration, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        setTimeLeft(duration); // reset if duration changes
    }, [duration]);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (onComplete) onComplete();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, onComplete]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <span className="font-mono text-lg text-[#f1112b]">
            {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
    );
};

export default Countdown;
