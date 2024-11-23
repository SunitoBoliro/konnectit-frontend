const WS_API_URL = import.meta.env.VITE_WS_URL; // Correct syntax for Vite

export const connectWebSocket = (token, onMessage, onError, onClose, onOpen) => {
    if (!token) {
        throw new Error("Token is required to connect to WebSocket");
    }

    const ws = new WebSocket(`${WS_API_URL}/${encodeURIComponent(token)}`); // Use the variable value

    ws.onopen = () => {
        console.log("Connected to WebSocket server");
        if (onOpen) onOpen();
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received message:", message);
        if (onMessage) onMessage(message);
    };

    ws.onclose = () => {
        console.error("WebSocket closed. Attempting to reconnect...");
        if (onClose) onClose();
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (onError) onError(error);
    };

    return ws;
};
