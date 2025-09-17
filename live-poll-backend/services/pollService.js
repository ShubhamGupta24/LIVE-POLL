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

const createPoll = ({ question, options, duration }) => {
    const poll = {
        id: Date.now().toString(),
        question,
        options: options.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect, votes: 0 })),
        duration,
        active: true,
    };
    console.log(poll)
    polls.push(poll);
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

const endPoll = (pollId) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return null;

    poll.active = false;
    return poll;
};

module.exports = { createPoll, submitVote, endPoll, getAllPolls, home, getPollById, getActivePoll };
