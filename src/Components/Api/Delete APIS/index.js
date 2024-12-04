import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Delete Chat History
export const deleteChatHistory = async (email, chatId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deletechathistory/${email}/${chatId}/`, {
      data: { chatId }, // Sending chatId in the request body
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting chat history:", error.response?.data || error.message);
    throw error.response?.data || { detail: "Failed to delete chat history" };
  }
};

// Delete User from Chats
export const deleteUserFromChats = async (email, currentUser) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteuser/${email}/${currentUser}/`, {
      
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user from chats:", error.response?.data || error.message);
    throw error.response?.data || { detail: "Failed to delete user from chats" };
  }
};
