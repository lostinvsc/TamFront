// src/socket.js
import { backendURL } from './config';
import { io } from "socket.io-client";

const socket = io(`${backendURL}`); // Update with your backend URL if deployed

export default socket;
