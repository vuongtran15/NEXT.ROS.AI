import React, { useState, useEffect, useRef } from "react";
import { UserMessage } from "./userMessage";
import { SystemMessage } from "./systemMessage";
import { InputControl } from "./inputControl";
import { fnGetUserFromLocalStorage } from "@/utils/local";

export function ChatContainer({ item }) {

    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    

    useEffect(() => {
        fnGetUserInfo();
        setMessages(item.chatHistory || []);
    }, [item.id]);


    const fnGetUserInfo = async () => {
        var user = fnGetUserFromLocalStorage();
        console.log(user);
    };

    

    const fnOnUserMessage = (message) => {
        console.log(message);
        const newUserMessage = {
            id: Date.now(),
            text: message,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prevMessages => [...prevMessages, newUserMessage]);

        // Simulate system response (in a real app, this would be from your API)
        setTimeout(() => {
            const systemResponse = {
                id: Date.now() + 1,
                text: "This is a simulated response. In a real application, this would come from your backend or AI service.",
                sender: "system",
                timestamp: new Date()
            };
            setMessages(prevMessages => [...prevMessages, systemResponse]);
        }, 1000);
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
