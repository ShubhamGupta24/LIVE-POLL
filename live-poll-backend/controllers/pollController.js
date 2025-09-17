// controllers/pollController.js

const PollService = require("../services/pollService");


const home = (req, res) => {
    try {
        PollService.home();
        res.status(201).json({ msg: "Welcome to our home page" });
    } catch (error) {
        console.log(error);
    }
};


const getPolls = (req, res) => {
    const polls = PollService.getAllPolls();
    console.log("Returning polls:", polls);
    return res.status(200).json({ success: true, polls });
};

const getPollById = (req, res) => {
    const pollId = req.params.id;
    const poll = PollService.getPollById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });
    return res.status(200).json({ success: true, poll });
};

const getActivePoll = (req, res) => {
    const poll = PollService.getActivePoll();
    if (!poll) return res.json({ success: true, poll: null });
    return res.json({ success: true, poll });
};

const createPoll = (req, res) => {
    const { question, options, duration } = req.body;
    if (!question || !options || options.length < 2)
        return res.status(400).json({ success: false, message: "Invalid input" });

    const newPoll = PollService.createPoll({ question, options, duration });
    const { getIO } = require("../socket");
    const io = getIO();
    io.emit("newPoll", newPoll);
    return res.status(201).json({ success: true, poll: newPoll });
};

const submitVote = (req, res) => {
    const { pollId, optionIndex } = req.body;
    const poll = PollService.submitVote(pollId, optionIndex);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // Lazy require to avoid circular dependency
    const { getIO } = require("../socket");
    const io = getIO();
    io.emit("updatePoll", poll);

    return res.json(poll);
};

const endPoll = (req, res) => {
    const { pollId } = req.body;
    const poll = PollService.endPoll(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    const { getIO } = require("../socket");
    const io = getIO();
    io.emit("endPoll", poll);

    return res.json({ message: "Poll ended", poll });
};

// Socket events
const handlePollEvents = (io, socket) => {
    const { getIO } = require("../socket");

    socket.on("vote", ({ pollId, optionIndex }) => {
        const poll = PollService.submitVote(pollId, optionIndex);
        if (poll) {
            const io = getIO();
            io.emit("updatePoll", poll);
            console.log(`Vote received for poll ${pollId}, option ${optionIndex}`);
        }
    });
};

module.exports = { createPoll, submitVote, endPoll, handlePollEvents, getPolls, home, getPollById, getActivePoll };
