// src/socket.js
import { io } from "socket.io-client";

let socket;
const API_URL = process.env.REACT_APP_BACKEND_CONNECT_API;
// connect only when called
export const initSocket = ({ userName, role } = {}) => {
    if (!socket) {
        const query = {};

        if (userName) query.userName = userName;
        if (role) query.role = role;

        socket = io(`${API_URL}/`, {
            transports: ["websocket"],
            query, // send only what is provided
        });
    }
    return socket;
};

export const getSocket = () => socket;
