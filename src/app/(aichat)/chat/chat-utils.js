import React, { useState, useEffect, useRef } from "react";
import { HiMiniMicrophone } from "react-icons/hi2";
import { IoAttachSharp } from "react-icons/io5";
import { renderChatMessageWithLineBreaks } from "@/utils/chatUtils";

export function RenderChatBoxContainer({ item }) {

    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setMessages([
            // Sample initial messages for demonstration
            { id: 1, text: "Hello! How can I help you today?", sender: "system", timestamp: new Date() },
            { id: 2, text: "I need help with React hooks", sender: "user", timestamp: new Date() },
            { id: 3, text: "Of course! React hooks are functions that let you use state and lifecycle features in functional components.\nWhat specific hook would you like to learn about?", sender: "system", timestamp: new Date() }
        ]);
    }, [item.id]);

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
                                <RenderUserMessageItem message={message} key={message.id} /> :
                                <RenderSystemMessageItem message={message} key={message.id} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>
            <div className="chat-control chat-container container mx-auto px-4 mb-2">
                <RenderChatInputControl allowTyping={true} onMessageSend={msg => fnOnUserMessage(msg)} />
            </div>
        </div>
    );
}

export function RenderChatInputControl({ allowTyping = true, onMessageSend }) {
    const maxLength = 500;
    const [charCount, setCharCount] = useState(0);
    const inputRef = React.useRef(null);

    const handlePaste = (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        const selection = window.getSelection();

        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            const currentLength = inputRef.current.innerText.length - selectedText.length;
            const remainingSpace = maxLength - currentLength;

            range.deleteContents();

            if (remainingSpace > 0) {
                const textToInsert = text.slice(0, remainingSpace);
                range.insertNode(document.createTextNode(textToInsert));

                // Move cursor to end of pasted text
                range.setStartAfter(range.endContainer);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);

                // Update character count after paste, accounting for replaced text
                setTimeout(() => {
                    const newText = inputRef.current.innerText;
                    setCharCount(newText.length);
                }, 0);
            }
        }
    };

    const handleInput = (e) => {
        // Get text and remove any hidden characters and extra spaces
        const text = e.currentTarget.innerText.replace(/\u200B/g, '').replace(/\n$/, '');
        setCharCount(text.length);

        if (text.length > maxLength) {
            e.currentTarget.innerText = text.slice(0, maxLength);
            setCharCount(maxLength);
            // Move cursor to end
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(e.currentTarget.childNodes[0], maxLength);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (!e.shiftKey) {
                e.preventDefault();
                const message = e.currentTarget.innerText.trim();
                if (message) {
                    sendMessage(message);
                    // Clear the input right after sending
                    if (inputRef.current) {
                        inputRef.current.innerText = '';
                        setCharCount(0);
                    }
                }
            }
        }
    };

    const sendMessage = (msg) => {
        if (!msg.trim()) return;
        if (onMessageSend) {
            onMessageSend(msg);
        }
        setCharCount(0);
    };

    return (
        <div className='chat-input-container relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-3'>
            <div
                ref={inputRef}
                contentEditable={allowTyping}
                className={`chat-input w-full min-h-[40px] max-h-32 overflow-y-auto px-2 focus:outline-none ${!allowTyping ? 'cursor-not-allowed bg-gray-100' : ''}`}
                spellCheck="false"
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                onPaste={allowTyping ? handlePaste : undefined}
                onInput={allowTyping ? handleInput : undefined}
                onKeyDown={allowTyping ? handleKeyDown : undefined}
                suppressContentEditableWarning={true}
                placeholder={allowTyping ? "Type a message..." : "Chat input is disabled"}
                onFocus={(e) => allowTyping && (e.currentTarget.dataset.placeholder = '')}
                onBlur={(e) => {
                    e.currentTarget.dataset.placeholder = allowTyping ? 'Type a message...' : 'Chat input is disabled';
                    if (allowTyping) {
                        const text = e.currentTarget.innerText.replace(/\u200B/g, '').replace(/\n$/, '');
                        setCharCount(text.length);
                    }
                }}
                data-placeholder={allowTyping ? "Type a message..." : "Chat input is disabled"}
            />

            <div className='chat-input-action flex flex-row justify-between items-center mt-2 px-2'>
                <div className='left-items'>
                    <span className={`text-xs ${charCount >= maxLength ? 'text-red-500' : 'text-gray-400'
                        }`}>
                        {charCount}/{maxLength}
                    </span>
                </div>
                <div className='right-items flex flex-row gap-3'>
                    <button
                        className={`action-btn p-1.5 rounded-full transition-colors text-gray-500 ${allowTyping ? 'hover:bg-gray-100 hover:text-gray-700' : 'opacity-50 cursor-not-allowed'
                            }`}
                        disabled={!allowTyping}
                    >
                        <IoAttachSharp size={18} />
                    </button>
                    <button
                        className={`action-btn p-1.5 rounded-full transition-colors text-gray-500 ${allowTyping ? 'hover:bg-gray-100 hover:text-gray-700' : 'opacity-50 cursor-not-allowed'
                            }`}
                        disabled={!allowTyping}
                    >
                        <HiMiniMicrophone size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export function RenderChatIntroduction({ addNewChat }) {
    return (
        <div className='main-chat'>
            <div className="chat-header"></div>
            <div className="chat-body">
                <div className="chat-introduction chat-container container mx-auto px-4 place-content-center">
                    <div className="chat-guide flex flex-col gap-4">
                        <div className="chat-name flex flex-row gap-4">
                            <div className="logo">
                                <img src="/images/aichat/bot.gif" alt="logo" />
                            </div>
                            <div className="chat-text flex flex-col gap-2  place-content-center">
                                <div className="bot-name font-medium text-2xl">Hi, I am Kibago, your personal AI assistant</div>
                                <div className="bot-description opacity-50">How can I help you?</div>
                            </div>
                        </div>
                        <div className="card-group grid grid-cols-3 gap-4 mt-4">
                            <div className=" card basis-1/3">
                                <div className="card-header font-medium pb-1 text-lg">Productivity Tool</div>
                                <div className="card-header-sub opacity-50 text-xs pl-2">Use for Office and Study</div>
                                <div className="card-body pt-5 flex flex-col gap-2.5">
                                    <RenderToolCardItem
                                        image={"/images/aichat/chat.png"}
                                        title={"Chat AI Assistant"}
                                        description={"Ask me anything!"} />
                                    <RenderToolCardItem
                                        image={"/images/aichat/document.png"}
                                        title={"Reading Assistant"}
                                        description={"Summarize and extract information from documents"} />
                                    <RenderToolCardItem
                                        image={"/images/aichat/voice.png"}
                                        title={"Voice Assistant"}
                                        description={"Convert text to speech and vice versa"} />
                                </div>
                            </div>
                            <div className="card basis-1/3"></div>
                            <div className="card basis-1/3"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chat-control chat-container container mx-auto px-4 mb-2">
                <RenderChatInputControl allowTyping={true} onMessageSend={msg => addNewChat(msg)} />
            </div>
        </div>
    );
}

function RenderToolCardItem({ image, title, description }) {
    return (<div className="body-item flex flex-row gap-5 py-3 px-3">
        <div className="img">
            <img src={image} alt="logo" />
        </div>
        <div className="description place-content-center">
            <div className="tilte font-medium pb-1.5">{title}</div>
            <div className="desc opacity-50">
                <span>{description}</span>
            </div>
        </div>
    </div>);
}

export function RenderSystemMessageItem({ message }) {
    return (<div key={message.id} className="message-container flex justify-start" >
        <div className="message max-w-[70%] p-3 rounded-lg bg-gray-200 text-gray-800 rounded-tl-none" >
            <div className="message-text">{renderChatMessageWithLineBreaks(message.text)}</div>
            {/* <div className="message-time text-xs mt-1 text-gray-500" >
                {formatChatMessageTime(message.timestamp)}
            </div> */}
        </div>
    </div>);
}

export function RenderUserMessageItem({ message }) {
    return (<div key={message.id} className="message-container flex justify-end">
        <div className="message max-w-[70%] p-3 rounded-lg bg-blue-500 text-white rounded-tr-none">
            <div className="message-text">{renderChatMessageWithLineBreaks(message.text)}</div>
            {/* <div className="message-time text-xs mt-1 text-blue-100" >
                {formatChatMessageTime(message.timestamp)}
            </div> */}
        </div>
    </div>);
}
