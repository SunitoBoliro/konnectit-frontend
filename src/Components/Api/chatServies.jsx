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

// API service for fetching messages (Polling)
export const fetchMessages = async (chatId, lastChecked = null) => {
    try {
        const params = {};
        if (lastChecked) params.last_checked = lastChecked;

        const response = await axios.get(`${API_BASE_URL}/chats/${chatId}/messages`, {
            params,
        });
        return response.data.new_messages;
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw error;
    }
};

// API service for sending messages
export const sendMessageApi = async (chatId, message, senderId, receiverId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chats/${chatId}/messages`, {
            sender_id: senderId,
            receiver_id: receiverId,
            content: message,
        });
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};
