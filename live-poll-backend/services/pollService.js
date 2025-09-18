// services/pollService.js
let polls = []; // In-memory store

const home = (req, res) => {
    try {
        console.log("Welcome to our home page");
    } catch (error) {
        console.log(error);
    }
};

const getAllPolls = () => {
    console.log("Fetching all polls:", polls);
    return polls;
};

const getPollById = (pollId) => {
    console.log("Fetching poll by ID:", pollId);
    return polls.find(p => p.id === pollId);
}

const getActivePoll = () => polls.find(p => p.active);

// services/pollService.js
const { getSocket } = require("../socket"); // adjust import to your setup

const createPoll = ({ question, options, duration }) => {
    const poll = {
        id: Date.now().toString(),
        question,
        options: options.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect, votes: 0 })),
        duration,
        active: true,
        createdAt: Date.now(),
    };

    polls.push(poll);

    // Auto-end poll after duration
    setTimeout(() => {
        const pollRef = polls.find(p => p.id === poll.id);
        if (pollRef && pollRef.active) {
            pollRef.active = false;

            console.log(`⏰ Poll "${pollRef.question}" ended automatically`);

            // 🚨 Broadcast to all clients
            const io = getSocket();
            io.emit("endPoll", pollRef);
        }
    }, duration * 1000);

    return poll;
};

const endPoll = (pollId) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return null;

    poll.active = false;

    console.log(`🛑 Poll "${poll.question}" ended manually`);

    // 🚨 Broadcast to clients
    const io = getSocket();
    io.emit("endPoll", poll);

    return poll;
};


const submitVote = (pollId, optionIndex) => {
    const poll = polls.find(p => p.id === pollId && p.active);
    if (!poll) return null;

    if (poll.options[optionIndex]) {
        poll.options[optionIndex].votes += 1;
    }
    return poll;
};

module.exports = { createPoll, submitVote, endPoll, getAllPolls, home, getPollById, getActivePoll };
