import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const CallInfo = ({selectedCallInfo}) => {
    const { id } = useParams(); // Get the call ID from the URL
    const navigate = useNavigate();

    // Dummy data for the selected call
    const callDetails = {
        1: {
            id: 1,
            name: "Ahsan Uni",
            time: "4:43 PM",
            status: "Outgoing",
            duration: "1 minute 18 seconds",
            logs: ["Call started", "Call ended after 1m 18s"],
        },
        2: {
            id: 2,
            name: "Huzaifa Zong",
            time: "3:15 PM",
            status: "Incoming",
            duration: "N/A",
            logs: ["Call started", "No answer"],
        },
        3: {
            id: 3,
            name: "Ahsan Uni",
            time: "Yesterday",
            status: "Outgoing",
            duration: "2 minutes 30 seconds",
            logs: ["Call started", "Call ended after 2m 30s"],
        },
    };

    // Get the current call details based on the id
    // console.log("id==>", id)
    const call = callDetails[sessionStorage.getItem("callinfo")];

    if (!call) {
        return <div className="text-white">Call not found.</div>;
    }

    return (
        <div className="bg-gray-900 text-white h-screen p-4">
            <h1
                className="text-2xl font-bold mb-4"
            >
                Call Info
            </h1>
            <div className="bg-gray-800 p-4 rounded-lg">
                <h1 className="text-xl font-bold mb-2">{call.name}</h1>
                <p className="text-sm text-gray-400">{call.time}</p>
                <p className="text-sm mt-2">{call.status} voice call</p>
                <p className="text-sm mt-2">{call.duration}</p>
                <div className="mt-4">
                    <h2 className="font-medium text-lg">Call Logs</h2>
                    <ul className="space-y-2 mt-2">
                        {call.logs.map((log, index) => (
                            <li key={index} className="text-sm text-gray-400">
                                {log}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CallInfo;
