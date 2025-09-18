// src/api.js
import axios from "axios";

// backend base URL
const API_URL = process.env.REACT_APP_BACKEND_CONNECT_API + "/api/polls";
console.log("🔗 API URL:", API_URL);

export const hello = () => axios.get(`${API_URL}`);

export const fetchPolls = () => axios.get(`${API_URL}/getPolls`);

export const fetchPollById = (pollId) => axios.get(`${API_URL}/getPoll/${pollId}`);

export const fetchActivePoll = () => axios.get(`${API_URL}/active`);

export const submitVote = (data) => axios.post(`${API_URL}/vote`, data);

export const createPoll = (data) => axios.post(`${API_URL}/create`, data);

export const endPoll = (data) => axios.post(`${API_URL}/end`, data);
