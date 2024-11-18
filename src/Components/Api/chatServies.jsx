import axios from "axios";

// Base URL for the API
const API_BASE_URL = "http://192.168.23.108:8000"; // Replace with your API base URL

// API service for getting chats
export const fetchChats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chats`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chats:", error);
        throw error;
    }
};

// API service for sending messages
export const sendMessageApi = async (chatId, message) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chats/${chatId}/messages`, {
            message,
        });
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};


// WebSocket connection for real-time messaging
export const createWebSocketConnection = () => {
    const socket = new WebSocket(`${API_BASE_URL}/ws`); // Replace with your WebSocket endpoint
    return socket; // Use this to send/receive messages
  };