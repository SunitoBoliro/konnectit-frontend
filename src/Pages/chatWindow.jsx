import React, { useState, useEffect, useRef } from "react";
import { fetchUserStatus, setupSSE } from "../Components/Api/chatServies";
import {MdDelete, MdOutlineAddIcCall, MdSend} from "react-icons/md";
import { FiSend } from "react-icons/fi";
import {BsFillMicFill, BsFillMicMuteFill, BsFillStopFill} from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from 'emoji-picker-react';

const ChatWindow = ({ chat, webSocket, messages, setMessages, chatId, handleCallInitiation }) => {
  const [newMessage, setNewMessage] = useState("");
  const [userStatus, setUserStatus] = useState({ online: false, last_seen: null });
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("currentLoggedInUser");
  const chatUser = localStorage.getItem("chatUser");
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (webSocket) {
      webSocket.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        if (receivedMessage.sender !== userEmail) {
          setMessages((prev) => [...prev, receivedMessage]);
        }
      };
    }
  }, [webSocket, setMessages]);

  useEffect(() => {
    const getUserStatus = async () => {
      try {
        const status = await fetchUserStatus(chatUser);
        setUserStatus(status);
      } catch (error) {
        console.error(error);
      }
    };

    getUserStatus();
  }, [chatUser]);
  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!chatUser) return;

    const handleMessage = (data) => setUserStatus(data);
    const handleError = (error) => console.error("SSE Error:", error);

    const eventSource = setupSSE(chatUser, handleMessage, handleError);

    return () => eventSource.close();
  }, [chatUser]);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support audio recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const audioChunks = [];
      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const base64Audio = await convertBlobToBase64(audioBlob);
        setAudioBlob(base64Audio);
        setIsAudioReady(true);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setAudioBlob(null);
      setIsAudioReady(false);
      clearInterval(timerRef.current);
      setRecordingDuration(0);
    }
  };

  const sendAudioMessage = () => {
    if (!audioBlob) return;

    const message = {
      chatId: chatUser,
      content: audioBlob,
      timestamp: new Date().toISOString(),
      sender: userEmail,
      type: "audio",
      format: "base64",
    };

    if (webSocket?.readyState === WebSocket.OPEN) {
      webSocket.send(JSON.stringify(message));
      setMessages((prev) => [...prev, message]);
      setAudioBlob(null);
      setIsAudioReady(false);
      setRecordingDuration(0);
    } else {
      console.error("WebSocket is not open");
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // Extract Base64 string
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim() && !audioBlob) return;

    const message = {
      chatId: chatUser,
      content: newMessage.trim() || audioBlob, // Send message or audio (if recorded)
      timestamp: new Date().toISOString(),
      sender: userEmail,
      type: newMessage.trim() ? "text" : "audio", // Use "audio" if no text
      format: audioBlob ? "base64" : undefined, // Include format if it's an audio
    };

    if (webSocket?.readyState === WebSocket.OPEN) {
      webSocket.send(JSON.stringify(message));
      setMessages((prev) => [...prev, message]);
      setNewMessage(""); // Reset text message input
      setAudioBlob(null); // Clear audio after sending
    } else {
      console.error("WebSocket is not open");
    }
  };

  return (
      <div className="bg-[#B1C381] h-screen flex flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-[#1B4242] p-4 shadow-md">
          <div className="flex items-center">
            <img
                src={chat.image}
                alt={`${chat.name} avatar`}
                className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
            />
            <div>
              <h1 className="text-xl font-bold text-white">{chat.name}</h1>
              <p className="text-sm text-gray-300">
                {userStatus.online
                    ? "Online"
                    : `Last seen at ${userStatus.last_seen ? new Date(userStatus.last_seen).toLocaleTimeString() : "unknown time"}`}
              </p>
            </div>
          </div>
          <button
              onClick={handleCallInitiation}
              className="flex items-center justify-center text-2xl p-3 text-white rounded-lg shadow-md hover:opacity-90 transition duration-300"
          >
            <MdOutlineAddIcCall />
          </button>
        </div>

        {/* Messages Section */}
        <div className="flex-grow overflow-y-auto custom-scrollbar mb-4 px-4">
          {messages.length > 0 ? (
              <ul className="space-y-2">
                {messages.map((msg, index) => (
                    <li
                        key={index}
                        className={`flex ${msg.sender === userEmail ? "justify-end" : "justify-start"}`}
                    >
                      {msg.type === "audio" ? (
                          <audio
                              controls
                              src={`data:audio/webm;base64,${msg.content}`}
                              className="rounded-lg"
                          ></audio>
                      ) : (
                          <div
                              className={`p-2 max-w-[70%] rounded-lg ${
                                  msg.sender === userEmail ? "bg-[#5C8374]" : "bg-[#5C8374]/60"
                              }`}
                          >
                            <p className="text-white">{msg.content}</p>
                            <small className="text-xs text-gray-200">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </small>
                          </div>
                      )}
                    </li>
                ))}
                <div ref={messagesEndRef} />
              </ul>
          ) : (
              <div className="text-gray-500 text-center">No messages yet</div>
          )}
        </div>

        {/* Sender Area */}
        <div className="flex items-center gap-2 p-4 bg-[#40414F] border-t border-gray-700 relative">
          {!isRecording && !isAudioReady && (
              <>
                <div className="relative flex-grow">
                  <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message"
                      className="w-full p-3 pr-10 rounded-lg bg-[#5C8374] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#9EC8B9] focus:outline-none"
                  />
                  <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition duration-300"
                  >
                    <BsEmojiSmile size={20} />
                  </button>
                </div>
                <button
                    onClick={sendMessage}
                    className="flex items-center justify-center p-3 bg-gradient-to-r from-[#1B4242] to-[#5C8374] text-white rounded-lg shadow-md hover:opacity-90 transition duration-300"
                >
                  <FiSend className="text-lg" />
                </button>
                <button
                    onClick={startRecording}
                    className="p-3 rounded-full bg-green-600 text-white"
                >
                  <BsFillMicFill />
                </button>
              </>
          )}
          {isRecording && (
              <div className="flex items-center justify-between w-full bg-[#5C8374] p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-white">{formatDuration(recordingDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                      onClick={cancelRecording}
                      className="text-white hover:text-red-500 transition duration-300"
                  >
                    <MdDelete size={24} />
                  </button>
                  <button
                      onClick={stopRecording}
                      className="text-white hover:text-yellow-500 transition duration-300"
                  >
                    <BsFillStopFill size={24} />
                  </button>
                </div>
              </div>
          )}
          {isAudioReady && (
              <div className="flex items-center justify-between w-full bg-[#5C8374] p-3 rounded-lg">
                <audio
                    controls
                    src={`data:audio/webm;base64,${audioBlob}`}
                    className="w-64"
                />
                <div className="flex items-center gap-2">
                  <button
                      onClick={() => {
                        setAudioBlob(null);
                        setIsAudioReady(false);
                      }}
                      className="text-white hover:text-red-500 transition duration-300"
                  >
                    <MdDelete size={24} />
                  </button>
                  <button
                      onClick={sendAudioMessage}
                      className="text-white hover:text-green-500 transition duration-300"
                  >
                    <MdSend size={24} />
                  </button>
                </div>
              </div>
          )}
          {showEmojiPicker && (
              <div
                  ref={emojiPickerRef}
                  className="absolute bottom-full left-2 mb-2"
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
          )}
        </div>
      </div>
  );
};



export default ChatWindow;
