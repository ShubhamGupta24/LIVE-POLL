// routes/pollRoutes.js
const express = require("express");
const router = express.Router();
const pollController = require("../controllers/pollController");


// Get all polls (needed for frontend to fetch polls)
router.route("/").get(pollController.home);
router.route("/getPolls").get(pollController.getPolls);
router.route("/getPoll/:id").get(pollController.getPollById);
router.route("/active").get(pollController.getActivePoll);
router.route("/create").post(pollController.createPoll);
router.route("/vote").post(pollController.submitVote);
router.route("/end").post(pollController.endPoll);

module.exports = router;
