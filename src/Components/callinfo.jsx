import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const CallInfo = () => {
    const { id } = useParams(); // Get the call ID from the URL
    const navigate = useNavigate();

    // Dummy data for the selected call
    const callDetails = {
        id: id,
        name: "Ahsan Uni",
        time: "4:43 PM",
        status: "Outgoing",
        duration: "1 minute 18 seconds",
    };

    return (
        <div className="bg-gray-900 text-white h-screen p-4">
            <button
                className="mb-4 px-4 py-2 bg-gray-800 rounded-lg"
                onClick={() => navigate("/")}
            >
                Back to Calls
            </button>
            <div className="bg-gray-800 p-4 rounded-lg">
                <h1 className="text-xl font-bold mb-2">{callDetails.name}</h1>
                <p className="text-sm text-gray-400">{callDetails.time}</p>
                <p className="text-sm mt-2">{callDetails.status} voice call</p>
                <p className="text-sm mt-2">{callDetails.duration}</p>
            </div>
        </div>
    );
};

export default CallInfo;
