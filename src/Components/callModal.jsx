import React, { useEffect, useRef, useState } from "react";
import { joinChat, joinRoom } from "./Api/chatServies.js";
import { BsFillMicMuteFill, BsFillMicFill, BsFillCameraVideoOffFill, BsFillCameraVideoFill } from "react-icons/bs";
import { MdCallEnd } from "react-icons/md";


const CallModal = ({ chatUser, onClose, currentLoggedInUser }) => {
    const jitsiContainerRef = useRef(null);
    const apiRef = useRef(null);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://jitsi.hamburg.ccc.de/external_api.js";
        script.onload = initJitsi;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
            if (apiRef.current) {
                apiRef.current.dispose();
            }
        };
    }, [chatUser]);

    const initJitsi = async () => {
        const userId = localStorage.getItem("currentLoggedInUser");
        const chatId = localStorage.getItem("chatUser");
        const response = await joinRoom(userId, chatId);
        const domain = "jitsi.hamburg.ccc.de";
        const options = {
            roomName: response.detail,
            width: "100%",
            height: "100%",
            parentNode: jitsiContainerRef.current,
            userInfo: {
                displayName: userId,
                email: userId,
            },
            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                disableAudioLevels: true,  // Disable audio levels display
                disableScreenSharing: true,  // Disable screen sharing
                toolbarButtons: [],
                disableRecording: true, // Disable the recording option
                disableLiveStreaming: true, // Disable live stream
                disableDialIn: true,  // Disables phone call-in feature

            },
            interfaceConfigOverwrite: {
                SHOW_USER_AVATAR: false, // Disable avatars showing, which could display names too
                SHOW_REACTIONS_BUTTON: false,  // Disables reactions button
                SHOW_AUDIO_MENU: false,  // Disables the audio settings button
                SHOW_VIDEO_MENU: false,  // Disables the video settings button
                SHOW_THROTTLE_MESSAGE: false, // Disable video throttling message
                SHOW_CHAT: false, // Hides the chat button
                SHOW_INVITE_BUTTON: false,  // Disables the invite button
                filmStripOnly: false,
                DEFAULT_LOGO_URL: '',
                SHOW_JITSI_WATERMARK: false,
                SHOW_POWERED_BY: false,
                SHOW_BRAND_WATERMARK: false,
            }
        };

        apiRef.current = new window.JitsiMeetExternalAPI(domain, options);
    };

    const muteAudio = () => {
        apiRef.current.executeCommand("toggleAudio");
        setIsAudioMuted(!isAudioMuted);
    };

    const muteVideo = () => {
        apiRef.current.executeCommand("toggleVideo");
        setIsVideoMuted(!isVideoMuted);
    };

    const endCall = () => {
        apiRef.current.dispose();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#1B4242] rounded-lg p-6 w-[70%] max-w-4xl h-[70%] max-h-3xl flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold self-center">Call with {chatUser}</h2>
                    {/*<button onClick={onClose} className="text-gray-500 hover:text-gray-700">*/}
                    {/*    Close*/}
                    {/*</button>*/}
                </div>

                <div ref={jitsiContainerRef} className="flex-grow"></div>

                <div className="flex justify-center mt-4">
                    <button onClick={muteAudio} className="bg-gray-300 text-gray-800  p-2 m-2 rounded-lg hover:bg-gray-400 transition duration-300">
                        {isAudioMuted ? (
                            <BsFillMicMuteFill size={24} />
                        ) : (
                            <BsFillMicFill size={24} />
                        )}
                    </button>
                    <button onClick={muteVideo} className="bg-gray-300 text-gray-800  p-2 m-2 rounded-lg hover:bg-gray-400 transition duration-300">
                        {isVideoMuted ? (
                            <BsFillCameraVideoOffFill size={24} />
                        ) : (
                            <BsFillCameraVideoFill size={24} />
                        )}
                    </button>
                    <button onClick={endCall} className="bg-gray-300 text-gray-800  p-2 m-2 rounded-lg hover:bg-gray-400 transition duration-300">
                        <MdCallEnd size = {24}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallModal;
