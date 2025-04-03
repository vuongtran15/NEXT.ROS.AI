"use client"; // Mark as a Client Component in Next.js

import { fnGetUserFromLocalStorage, LocalStorageKeys } from "@/utils/local";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function useChatWebSocket(chatid, type, callbackCommand = null) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const reconnectAttemptRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  const connect = () => {
    var user = fnGetUserFromLocalStorage();
    var empid = user?.empid || "";

    if (empid === "" || empid === undefined) {
      msgEmployeeIdNotFound();
      return;
    }


    const socket = new WebSocket(LocalStorageKeys.SERVER_CHAT_URL + "/ws/" + empid + "__" + chatid + "__" + type + "__" + Date.now());
    socketRef.current = socket;

    // Handle connection open
    socket.onopen = () => {
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
      // reconnect nó phạm vào việc đổi chatid
      if (mountedRef.current && event.code !== 1005) {
        attemptReconnect();
      }
    };


    // Handle incoming messages
    socket.onmessage = (event) => handRecieiveMessage(event);

  };


  const handRecieiveMessage = (event) => {
    var data = JSON.parse(event.data);
    if (data.content == "END_OF_MESSAGE") {
      fnCallBackCommand("END_OF_MESSAGE");
      return;
    }
    var msgId = data.msgid;

    setMessages((prevMessages) => {

      // Check if the message already exists in the state
      const existingIndex = prevMessages.findIndex(m => m.id === msgId);
      if (existingIndex !== -1) {
        // If it exists, update the message text
        var thinkingMsg = "...";

        const updatedMessages = [...prevMessages];
        updatedMessages[existingIndex] = {
          ...updatedMessages[existingIndex],
          text: updatedMessages[existingIndex].text == thinkingMsg ? data.content : updatedMessages[existingIndex].text + data.content
        };
        return updatedMessages;
      } else {
        // If it doesn't exist, add a new message to the state
        let msg = {
          id: msgId,
          text: data.content,
          sender: "assistant",
          dataType: "text",
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        return [...prevMessages, msg];
      }

    })
  }

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

  const fnCallBackCommand = (command) => {
    if (callbackCommand && typeof callbackCommand === "function") {
      callbackCommand(command);
    }
  }

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

  const msgEmployeeIdNotFound = () => {
    setTimeout(() => {
      var newUserMessage = {
        id: uuidv4(),
        text: "Employee ID not found",
        sender: "system", //system
        dataType: "text",
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    }, 1000);
  }

  const destroyWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  // Function to send messages
  const sendMessage = (data) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      var msg = [
        {
          id: uuidv4(),
          text: data.text,
          sender: "user", //system
          dataType: "text",
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      ];
      var newUserMessage = msg.find(m => m.dataType === "text") || msg[0];

      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      socketRef.current.send(
        JSON.stringify(msg)
      );
    } else {
      console.log("Socket not open, retrying to send message...");
      // Retry counter
      let retryCount = 0;
      const maxRetries = 5;

      var interval = setInterval(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          sendMessage(data); // Retry sending the message
        } else {
          retryCount++;
          console.log(`Socket not open yet, retrying... (${retryCount}/${maxRetries})`);

          if (retryCount >= maxRetries) {
            clearInterval(interval);
            console.log("Max retry attempts reached. Message not sent.");
          }
        }
      }, 300);
    }
  };

  const setChatMessages = (newMessages) => {
    setMessages(newMessages);
  };

  return { messages, setChatMessages, sendMessage, destroyWebSocket };
}