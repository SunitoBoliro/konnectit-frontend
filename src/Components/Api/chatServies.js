import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_URL ;

// Fetch User Status
export const fetchUserStatus = async (chatUser) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user-status/${chatUser}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user status:", error);
      throw error;
    }
  };



// Set up SSE for user status updates
export const setupSSE = (chatUser, onMessage, onError) => {
    const eventSource = new EventSource(`${API_BASE_URL}/sse/user-status/${chatUser}`);
  
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };
  
    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      onError(error);
      eventSource.close();
    };
  
    return eventSource; // Return the instance to allow manual closure
  };

// Add more API functions as needed
const getToken = () => localStorage.getItem("token");

export const fetchUsers = async () => {
    const token = getToken();
    const email = localStorage.getItem("currentLoggedInUser")
    if (!token) throw new Error("Token not found in local storage");
    const response = await axios.get(`${API_BASE_URL}/users/${email}`, {
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

export const joinRoom = async (userId, chatId) => {
    const token = getToken();  // Get token (if necessary)
    if (!token) throw new Error("Token not found in local storage");
    const response = await axios.get(`${API_BASE_URL}/room/${userId}/${chatId}`, {
        params: { token: encodeURIComponent(token) },
    });
    return response.data;
}
