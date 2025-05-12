// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://tambola-ppuw.onrender.com"); // Update with your backend URL if deployed

export default socket;
