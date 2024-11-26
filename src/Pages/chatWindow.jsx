import React, { useState, useEffect, useRef } from "react";
import { fetchUserStatus, setupSSE } from "../Components/Api/chatServies";
import pp from "../assets/img.png"
import {
  MdOutlineAddIcCall,
  MdDelete,
  MdSend,
  MdPlayArrow,
  MdPause
} from "react-icons/md";
import {
  BsFillMicFill,
  BsFillStopFill,
  BsEmojiSmile
} from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import EmojiPicker from 'emoji-picker-react';
// import ContextMenu from "../Components/contextMenu.jsx";
// import UserModal from "../Components/UserInfoModal";

const ChatWindow = ({ chat, webSocket, messages, setMessages, chatId, handleCallInitiation }) => {
  const [newMessage, setNewMessage] = useState("");
  const [userStatus, setUserStatus] = useState({ online: false, last_seen: null });
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPlaying, setIsPlaying] = useState({});
  const [currentTime, setCurrentTime] = useState({});
  const [duration, setDuration] = useState({});

  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("currentLoggedInUser");
  const chatUser = localStorage.getItem("chatUser");
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const audioRefs = useRef({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: chatUser,
    avatar: "https://via.placeholder.com/150", // Default avatar
  });

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateAvatar = (newAvatar) => {
    setUser((prev) => ({ ...prev, avatar: newAvatar }));
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
  }, [webSocket, setMessages, userEmail]);

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

  useEffect(() => {
    if (!chatUser) return;

    const handleMessage = (data) => setUserStatus(data);
    const handleError = (error) => console.error("SSE Error:", error);

    const eventSource = setupSSE(chatUser, handleMessage, handleError);

    return () => eventSource.close();
  }, [chatUser]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

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

  const sendMessage = () => {
    if (!newMessage.trim() && !audioBlob) return;

    const message = {
      chatId: chatUser,
      content: newMessage.trim() || audioBlob,
      timestamp: new Date().toISOString(),
      sender: userEmail,
      type: newMessage.trim() ? "text" : "audio",
      format: audioBlob ? "base64" : undefined,
    };

    if (webSocket?.readyState === WebSocket.OPEN) {
      webSocket.send(JSON.stringify(message));
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      setAudioBlob(null);
    } else {
      console.error("WebSocket is not open");
    }
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = (index) => {
    if (audioRefs.current[index]) {
      if (isPlaying[index]) {
        audioRefs.current[index].pause();
      } else {
        audioRefs.current[index].play();
      }
      setIsPlaying((prev) => ({ ...prev, [index]: !prev[index] }));
    }
  };

  const handleTimeUpdate = (index) => {
    if (audioRefs.current[index]) {
      setCurrentTime((prev) => ({ ...prev, [index]: audioRefs.current[index].currentTime }));
    }
  };

  const handleLoadedMetadata = (index) => {
    if (audioRefs.current[index]) {
      setDuration((prev) => ({ ...prev, [index]: audioRefs.current[index].duration }));
    }
  };

  const handleAudioEnded = (index) => {
    setIsPlaying((prev) => ({ ...prev, [index]: false }));
  };

  return (
      <div className="bg-[#B1C381] h-screen flex flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-[#1B4242] p-4 shadow-md">
          <div className="flex items-center">
          <img
        src={localStorage.getItem("pp")}
        alt={`${user.name}'s avatar`}
        className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-sm cursor-pointer"
        onClick={handleAvatarClick}
      />
      {/* <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={user}
        onUpdateAvatar={handleUpdateAvatar}
      /> */}
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
        <div className="flex-grow overflow-y-auto custom-scrollbar mt-4 mb-4 px-4">
  {messages.length > 0 ? (
    <ul className="space-y-4">
      {messages.map((msg, index) => (
        <li
          key={index}
          className={`flex ${msg.sender === userEmail ? "justify-end" : "justify-start"}`}
        >
          {msg.type === "audio" ? (
            <div
              className={`p-3 rounded-2xl shadow-md border ${
                msg.sender === userEmail ? "bg-[#DCF8C6] border-[#A1D6B3]" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handlePlayPause(index)}
                  className="text-[#075E54] hover:text-[#128C7E] transition-all focus:outline-none"
                >
                  {isPlaying[index] ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
                </button>
                <div className="w-48 h-1 bg-gray-300 rounded-full relative">
                  <div
                    className="h-full bg-[#128C7E] rounded-full absolute top-0 left-0"
                    style={{ width: `${(currentTime[index] / duration[index]) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-[#075E54]">
                  {formatDuration(Math.floor(currentTime[index] || 0))}
                </span>
              </div>
              <audio
                ref={(ref) => (audioRefs.current[index] = ref)}
                src={`data:audio/webm;base64,${msg.content}`}
                onTimeUpdate={() => handleTimeUpdate(index)}
                onLoadedMetadata={() => handleLoadedMetadata(index)}
                onEnded={() => handleAudioEnded(index)}
                className="hidden"
              ></audio>
            </div>
          ) : (
            <div
              className={`p-4 max-w-[70%] rounded-2xl shadow-md ${
                msg.sender === userEmail
                  ? "bg-[#DCF8C6] border border-[#A1D6B3]"
                  : "bg-white border border-gray-200"
              }`}
            >
              <p className="text-sm text-[#075E54] break-words">{msg.content}</p>
              <div className="text-right mt-2">
                <small className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </small>
              </div>
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
        <div className="flex items-center gap-2 p-4 bg-[#F0F2F5] border-t border-gray-300 relative">
          {!isRecording && !isAudioReady && (
              <>
                <div className="relative flex-grow">
                  <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message"
                      className="w-full p-3 pr-10 rounded-full bg-white text-[#075E54] placeholder-[#128C7E] focus:ring-2 focus:ring-[#128C7E] focus:outline-none"
                  />
                  <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#128C7E] hover:text-[#075E54] transition duration-300"
                  >
                    <BsEmojiSmile size={20} />
                  </button>
                </div>
                <button
                    onClick={sendMessage}
                    className="flex items-center justify-center p-3 bg-[#128C7E] text-white rounded-full shadow-md hover:bg-[#075E54] transition duration-300"
                >
                  <FiSend className="text-lg" />
                </button>
                <button
                    onClick={startRecording}
                    className="p-3 rounded-full bg-[#128C7E] text-white hover:bg-[#075E54] transition duration-300"
                >
                  <BsFillMicFill />
                </button>
              </>
          )}
          {isRecording && (
              <div className="flex items-center justify-between w-full bg-white p-3 rounded-full">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-[#075E54]">{formatDuration(recordingDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                      onClick={cancelRecording}
                      className="text-[#075E54] hover:text-red-500 transition duration-300"
                  >
                    <MdDelete size={24} />
                  </button>
                  <button
                      onClick={stopRecording}
                      className="text-[#075E54] hover:text-[#128C7E] transition duration-300"
                  >
                    <BsFillStopFill size={24} />
                  </button>
                </div>
              </div>
          )}
          {isAudioReady && (
              <div className="flex items-center justify-between w-full bg-white p-3 rounded-full">
                <div className="flex items-center space-x-2 flex-grow">
                  <button
                      onClick={handlePlayPause}
                      className="text-[#075E54] hover:text-[#128C7E] transition-colors"
                  >
                    {isPlaying[0] ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
                  </button>
                  <div className="w-48 h-1 bg-[#075E54] rounded-full">
                    <div
                        className="h-full bg-[#128C7E] rounded-full"
                        style={{ width: `(currentTime[0] / duration[0]) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-[#075E54]">
                {formatDuration(Math.floor(currentTime[0] || 0))}
              </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                      onClick={() => {
                        setAudioBlob(null);
                        setIsAudioReady(false);
                      }}
                      className="text-[#075E54] hover:text-red-500 transition duration-300"
                  >
                    <MdDelete size={24} />
                  </button>
                  <button
                      onClick={sendAudioMessage}
                      className="text-[#075E54] hover:text-[#128C7E] transition duration-300"
                  >
                    <MdSend size={24} />
                  </button>
                </div>
              </div>
          )}
          {showEmojiPicker && (
              <div
                  ref={emojiPickerRef}
                  className="absolute bottom-full left-0 mb-2"
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
          )}
        </div>
      </div>
  );
};

export default ChatWindow;

