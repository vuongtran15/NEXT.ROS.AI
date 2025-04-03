"use client";
import React, { useState, useEffect, useRef } from "react";
import { UserMessage } from "./userMessage";
import { AssistantMessage } from "./assistantMessage";
import { InputControl } from "./inputControl";
import useChatWebSocket from "@/hooks/useChatWebSocket";
import apiClient from "@/utils/apiClient";


export function ChatContainer({ item, setChatDataSource }) {

    const { messages, setChatMessages, sendMessage, destroyWebSocket } = useChatWebSocket(item.id, item.type, (command, msg) => fnWebSocketCallbackCommand(command, msg));
    const [allowTyping, setAllowTyping] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {

        fnGetChatMessages();
        setAllowTyping(true);

        return () => {
            destroyWebSocket();
        }

    }, [item.id]);

    const fnGetChatMessages = () => {
        apiClient.get("/api/aichat/Client/message/list?conversationId=" + item.id).then((response) => {
            setChatMessages(response || []);
            if (item.newMsg && item.newMsg.text !== "") {
                sendMessage({
                    text: item.newMsg.text,
                });
            }

        }).catch((error) => {
            console.error("Error fetching chat messages:", error);
        });
    }

    const fnOnUserMessage = (msg) => {
        setAllowTyping(false);
        sendMessage({
            text: msg.text,
        });
    };

    const fnWebSocketCallbackCommand = (command, msg) => {
        fnUpdateChatTitle();
        
        if (command == "END_OF_MESSAGE") {
            setAllowTyping(true);
            fnUpdateChatTitle();
        }
    }

    const fnUpdateChatTitle = () => {

        if(item.title == "New Conversation") {
            apiClient.get("/api/aichat/Client/conversation/title?conversationId=" + item.id).then((response) => {
                setChatDataSource((prevChatDataSource) => {
                    return prevChatDataSource.map((chat) => {
                        if (chat.id === item.id) {
                            return { ...chat, title: response.title };
                        }
                        return chat;
                    });
                });
            }).catch((error) => {
                console.error("Error updating chat title:", error);
            });
        }

        
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className='main-chat chat-box-page'>
            <div className="chat-header font-medium p-5 content-center flex flex-row">
                <div className="text text-xl content-center">{item.title}</div>
            </div>
            <div className="chat-body">
                <div className="chat-introduction chat-container container mx-auto px-4 pt-2">
                    <div className="chat-messages space-y-4">
                        {messages.map((message) => (
                            message.sender === 'user' ?
                                <UserMessage message={message} key={message.id} /> :
                                <AssistantMessage message={message} key={message.id} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>
            <div className="chat-control chat-container container mx-auto px-4 mb-2">
                <InputControl allowTyping={allowTyping} onMessageSend={msg => fnOnUserMessage(msg)} />
            </div>
        </div>
    );
}
