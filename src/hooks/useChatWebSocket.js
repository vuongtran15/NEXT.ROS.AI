"use client"; // Mark as a Client Component in Next.js

import { fnGetUserFromLocalStorage, LocalStorageKeys } from "@/utils/local";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function useChatWebSocket(chatid) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const reconnectAttemptRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  const connect = () => {
    var user = fnGetUserFromLocalStorage();
    console.log("User from local storage:", user);
    console.log("Chat ID:", chatid);
    // random uuid for the socket connection
    var uuid = uuidv4();
    uuid = uuid.replace(/-/g, "");

    const socket = new WebSocket(LocalStorageKeys.SERVER_CHAT_URL + "/ws/" + chatid + "_" + uuid);
    socketRef.current = socket;

    // Handle connection open
    socket.onopen = () => {
      console.log("WebSocket connection established");
      // Reset reconnect attempts on successful connection
      reconnectAttemptRef.current = 0;
    };
    // Handle errors
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Handle connection close
    socket.onclose = (event) => {
      console.log("WebSocket connection closed", event.code, event.reason);

      // Attempt to reconnect if not a normal closure and component is still mounted
      if (mountedRef.current && event.code !== 1000) {
        attemptReconnect();
      }
    };


    // Handle incoming messages
    socket.onmessage = (event) => {
      console.log("Received message:", event.data);
      var msg = {
        id: Date.now(),
        text: event.data,
        sender: "system", //system
        timestamp: new Date()
      };

      setMessages((prevMessages) => [...prevMessages, msg]);
    };

  };

  const attemptReconnect = () => {
    if (reconnectAttemptRef.current >= maxReconnectAttempts) {
      console.log("Max reconnection attempts reached");
      return;
    }

    const reconnectDelay = Math.min(1000 * (2 ** reconnectAttemptRef.current), 30000);
    console.log(`Attempting to reconnect in ${reconnectDelay}ms (attempt ${reconnectAttemptRef.current + 1})`);

    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttemptRef.current += 1;
      connect();
    }, reconnectDelay);
  };

  useEffect(() => {
    mountedRef.current = true;
    connect();

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [chatid]); // Re-run effect if URL changes

  // Function to send messages
  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      var newUserMessage = {
        id: Date.now(),
        text: message,
        sender: "user", //system
        timestamp: new Date()
      };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      socketRef.current.send(message);
    }else{
      console.log("Socket not open, retrying to send message...");
      // timeinterval to check if the socket is open
      var interval = setInterval(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          sendMessage(message); // Retry sending the message
        } else {
          console.log("Socket not open yet, retrying...");
        }
      }, 300); // Check every second
    }
  };

  const setChatMessages = (newMessages) => {
    setMessages(newMessages);
  };

  return { messages, setChatMessages, sendMessage };
}