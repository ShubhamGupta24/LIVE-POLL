// controllers/pollController.js
const PollService = require("../services/pollService");

const home = (req, res) => {
    try {
        PollService.home();
        res.status(200).json({ msg: "Welcome to our home page" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getPolls = (req, res) => {
    try {
        const polls = PollService.getAllPolls();
        console.log("Returning polls:", polls);
        return res.status(200).json({ success: true, polls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getPollById = (req, res) => {
    try {
        const pollId = req.params.id;
        const poll = PollService.getPollById(pollId);
        if (!poll) return res.status(404).json({ message: "Poll not found" });
        return res.status(200).json({ success: true, poll });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getActivePoll = (req, res) => {
    try {
        const poll = PollService.getActivePoll();
        return res.json({ success: true, poll: poll || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ fixed createPoll as Express route handler
const createPoll = (req, res) => {
    try {
        const { question, options, duration } = req.body;
        const poll = PollService.createPoll({ question, options, duration });
        // 👇 Emit new poll to all connected clients (students)
        const { getIO } = require("../socket");
        const io = getIO();
        io.emit("newPoll", poll);
        return res.status(201).json({ success: true, poll });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const submitVote = (req, res) => {
    try {
        const { pollId, optionIndex } = req.body;
        const poll = PollService.submitVote(pollId, optionIndex);
        if (!poll) return res.status(404).json({ message: "Poll not found or inactive" });

        const { getIO } = require("../socket");
        const io = getIO();
        io.emit("updatePoll", poll);

        return res.json({ success: true, poll });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const endPoll = (req, res) => {
    try {
        const { pollId } = req.body;
        const poll = PollService.endPoll(pollId);
        if (!poll) return res.status(404).json({ message: "Poll not found" });

        const { getIO } = require("../socket");
        const io = getIO();
        io.emit("endPoll", poll);

        return res.json({ message: "Poll ended", poll });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
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

module.exports = {
    createPoll,
    submitVote,
    endPoll,
    handlePollEvents,
    getPolls,
    home,
    getPollById,
    getActivePoll
};
