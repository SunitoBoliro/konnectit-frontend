const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302",
            },
        ],
    });

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            sendIceCandidate(event.candidate);
        }
    };

    pc.ontrack = (event) => {
        console.log("Track received:", event.track);
        // Handle the track (e.g., add it to a video element)
    };

    return pc;
};

const sendIceCandidate = (candidate) => {
    const token = localStorage.getItem("token");
    const sender = localStorage.getItem("currentLoggedInUser");
    const recipient = localStorage.getItem("chatUser");

    const candidateData = {
        recipient,
        session_id: localStorage.getItem("session_id"),
        candidate,
    };

    axios.post(
        `http://192.168.23.109:8000/call-ice-candidate/${sender}/${recipient}`,
        candidateData,
        { params: { token: encodeURIComponent(token) } }
    ).catch((error) => {
        console.error("Error sending ICE candidate:", error);
    });
};

export { createPeerConnection };