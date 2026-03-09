import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { CHAT_URLS } from "../../config";

const socket = io(CHAT_URLS.SERVER, { withCredentials: true });

function ChatApp() {
  const [message, setMessage] = useState(""); // The message input
  const [messages, setMessages] = useState([]); // Store the chat messages
  const [room, setRoom] = useState(""); // The room (typically landlord's unique ID or a room name)
  const [userType, setUserType] = useState(""); // The user type (hunter or landlord)

  // Handle incoming messages
  useEffect(() => {
    // Listen for incoming messages for the specific room
    socket.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for errors (invalid room/user type)
    socket.on("error", (error) => {
      console.log("Error:", error);
    });

    return () => {
      socket.off("receive-message");
      socket.off("error");
    };
  }, []);

  // Join the room (hunter or landlord will join their respective rooms)
  const joinRoom = () => {
    if (!room || !userType) {
      alert("Please enter a valid room ID and user type.");
      return;
    }

    // Emit the event to join a room
    socket.emit("join-room", { room, userType });
  };

  // Send a message to the specific room
  const sendMessage = () => {
    if (message.trim()) {
      // Emit the message to the server for the specific room
      socket.emit("message", { room, message });
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div style={{ marginTop: '100px' }}> {/* Added more margin top to ensure navbar is visible */}
      <h2>Chat System</h2>

      <div>
        {/* Room ID input */}
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter Room ID (Landlord's ID)"
        />
        {/* User type input (hunter or landlord) */}
        <input
          type="text"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          placeholder="Enter User Type (hunter or landlord)"
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>

      <div>
        {/* Message input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div>
        <h3>Messages:</h3>
        {/* Display messages */}
        {messages.map((msg, index) => (
          <div key={index}>
            {typeof msg === "object" ? (
              <span>
                <strong>{msg.senderEmail === room ? "Landlord" : "Hunter"}:</strong> {msg.message}
              </span>
            ) : (
              msg
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatApp;
