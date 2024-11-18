import axios from "axios";

const API_BASE_URL = "http://192.168.23.109:8000"; // Adjust this URL to match your backend

// Get token from localStorage
export const getToken = () => localStorage.getItem("token");

// Validate token by making an API call via GET
export const validateToken = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/validate`, {
            params: { token }, // Send token as query parameter
        });
        return response.data.isValid; // Assuming the backend returns `isValid`
    } catch (error) {
        console.error("Token validation failed:", error);
        return false;
    }
};

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
        const token = response.data.token;
        localStorage.setItem("token", token); // Store token on successful login
        return response.data;
    } catch (error) {
        throw error.response.data.detail;
    }
};
