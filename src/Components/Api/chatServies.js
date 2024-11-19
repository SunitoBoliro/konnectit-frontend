import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_URL ;

// Fetch User Status
// export const fetchUserStatus = async (chatUser) => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/user-status/${chatUser}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching user status:", error);
//         throw error;
//     }
// };

// Add more API functions as needed
const getToken = () => localStorage.getItem("token");

export const fetchUsers = async () => {
    const token = getToken();
    if (!token) throw new Error("Token not found in local storage");
    const response = await axios.get(`${API_BASE_URL}/users`, {
        params: { token: encodeURIComponent(token) },
    });
    return response.data;
};

export const fetchMessages = async (chatId, sender) => {
    const token = getToken();
    if (!token) throw new Error("Token not found in local storage");
    const response = await axios.get(`${API_BASE_URL}/messages/${chatId}/${sender}`, {
        params: { token: encodeURIComponent(token) },
    });
    return response.data;
};

export const joinChat = async (userId, chatId) => {
    const token = getToken();
    if (!token || !userId) throw new Error("Token or User ID not found in local storage");
    const response = await axios.post(
        `${API_BASE_URL}/chats/${userId}/join`,
        { chatId },
        { params: { token: encodeURIComponent(token) } }
    );
    return response.data;
};