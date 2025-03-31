"use client";
import React, { useState, useEffect, useRef } from "react";
import { UserMessage } from "./userMessage";
import { SystemMessage } from "./systemMessage";
import { InputControl } from "./inputControl";
import useChatWebSocket from "@/hooks/useChatWebSocket";


export function ChatContainer({ item }) {

    const { messages, setChatMessages, sendMessage } = useChatWebSocket(item.id, item.type);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        setChatMessages(item.chatHistory || []);
        if (item.newMsg && item.newMsg !== "") {
            sendMessage(item.newMsg);
        }
    }, [item.id]);

    const fnOnUserMessage = (message) => {
        sendMessage(message);
    };

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
                                <SystemMessage message={message} key={message.id} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>
            <div className="chat-control chat-container container mx-auto px-4 mb-2">
                <InputControl allowTyping={true} onMessageSend={msg => fnOnUserMessage(msg)} />
            </div>
        </div>
    );
}
