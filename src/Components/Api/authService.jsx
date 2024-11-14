// src/services/authService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Adjust this URL to match your backend

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data.detail;
    }
};

// Login user
export const loginUser = async (loginData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, loginData);
        return response.data;
    } catch (error) {
        throw error.response.data.detail;
    }
};
