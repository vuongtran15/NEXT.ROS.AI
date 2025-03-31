"use client"; // Mark as a Client Component in Next.js

import { fnGetUserFromLocalStorage, LocalStorageKeys } from "@/utils/local";
import { useEffect, useRef, useState } from "react";

export default function useChatWebSocket(chatid) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize Socket.IO client
    var user = fnGetUserFromLocalStorage();
    console.log("User from local storage:", user);
    console.log("Chat ID:", chatid);

    const socket = new WebSocket(LocalStorageKeys.SERVER_CHAT_URL + "/ws/"+  + chatid);
    socketRef.current = socket;

    // Handle connection open
    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    // Handle incoming messages
    socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    // Handle errors
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Handle connection close
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, [chatid]); // Re-run effect if URL changes

  // Function to send messages
  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  };

  const setChatMessages = (newMessages) => {
    setMessages(newMessages);
  };

  return { messages, setChatMessages, sendMessage };
}