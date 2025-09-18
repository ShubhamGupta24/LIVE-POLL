// services/pollService.js
let polls = []; // In-memory store (resets on server restart)

// ✅ For debugging
const logPolls = () => console.log("📋 Current Polls:", JSON.stringify(polls, null, 2));

const home = (req, res) => {
    res.send("Welcome to Poll Service 🚀");
};

const getAllPolls = () => {
    logPolls();
    return polls;
};

const getPollById = (pollId) => {
    console.log("Fetching poll by ID:", pollId);
    return polls.find((p) => p.id === pollId);
};

const getActivePoll = () => polls.find((p) => p.active);

const createPoll = ({ question, options, duration }) => {
    const poll = {
        id: Date.now().toString(),
        question,
        options: options.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            votes: 0,
        })),
        duration,
        active: true,
        createdAt: Date.now(),
    };

    polls.push(poll);
    logPolls();

    // ⏰ Timer logic should not emit sockets here anymore
    // Controller will handle "endPoll" when needed

    return poll;
};

const endPoll = (pollId) => {
    const poll = polls.find((p) => p.id === pollId);
    if (!poll) return null;

    poll.active = false;
    console.log(`🛑 Poll "${poll.question}" ended manually`);

    // Do NOT emit socket here
    return poll;
};

const submitVote = (pollId, optionIndex) => {
    const poll = polls.find((p) => p.id === pollId && p.active);
    if (!poll) return null;

    if (poll.options[optionIndex]) {
        poll.options[optionIndex].votes += 1;
    }
    return poll;
};

module.exports = {
    createPoll,
    submitVote,
    endPoll,
    getAllPolls,
    home,
    getPollById,
    getActivePoll,
};
