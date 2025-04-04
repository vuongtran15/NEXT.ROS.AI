"use client";
import React, { useState } from 'react';
import './page.scss';
import { FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { ChatContainer, Introduction } from './utils.js';
import apiClient from '@/utils/apiClient';
import { v4 as uuidv4 } from 'uuid';


const ChatPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [chatDataSource, setChatDataSource] = useState([]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const fnGetConversationByEmpId = () => {
        apiClient.get("/api/aichat/Client/GetListByEmpId")
            .then((conversations) => {

                setChatDataSource(conversations || []);

            })
            .catch((error) => {
                console.error("Error fetching conversations:", error);
            });
    }

    React.useEffect(() => {
        fnGetConversationByEmpId();
    }, []);

    const addNewChat = (msg) => {
        // clear isActive for all chats
        const updatedHistory = chatDataSource.map(chat => ({
            ...chat,
            isActive: false
        }));


        const newChat = {
            id: uuidv4(),
            title: 'New Conversation',
            date: new Date().toISOString().split('T')[0],
            isActive: true,
            type: 'text',
            newMsg: msg || {},
        };
        setChatDataSource([newChat, ...updatedHistory]);
    };

    const selectChat = (id) => {
        const updatedHistory = chatDataSource.map(chat => ({
            ...chat,
            isActive: chat.id === id
        }));
        setChatDataSource(updatedHistory);
    };

    const deleteChat = (e, id) => {
        e.stopPropagation(); // Prevent triggering selectChat
        const updatedHistory = chatDataSource.filter(chat => chat.id !== id);

        apiClient.delete(`/api/aichat/Client/conversation/delete?conversationId=${id}`).then(() => {
            console.log("Chat deleted successfully");
        }).catch((error) => {
            console.error("Error deleting chat:", error);
        });

        // If we're deleting the active chat, make the first remaining chat active
        if (chatDataSource.find(chat => chat.id === id)?.isActive && updatedHistory.length > 0) {
            updatedHistory[0].isActive = true;
        }

        setChatDataSource(updatedHistory);
    };

    const filteredChats = chatDataSource.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='chat-page'>
            <div className='chat-catgory'>
                <div className='header-box'>
                    <div className='search-and-new-row'>
                        <div className='search-box'>
                            <input
                                type="text"
                                placeholder="Search chats..."
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                            <button className="search-icon">
                                <FiSearch size={16} />
                            </button>
                        </div>
                        <button className='add-new-chat-button' onClick={e => addNewChat({text: ""})}>
                            <FiEdit size={18} />
                        </button>
                    </div>
                </div>
                <div className='chat-history'>
                    {filteredChats.length > 0 ? (
                        filteredChats.map(chat => (
                            <div
                                key={chat.id}
                                className={`chat-item ${chat.isActive ? 'active' : ''}`}
                                onClick={() => selectChat(chat.id)}
                            >
                                <div className="chat-info">
                                    <h4>{chat.title}</h4>
                                </div>
                                <button
                                    className="delete-chat"
                                    onClick={(e) => deleteChat(e, chat.id)}
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">No chats found</div>
                    )}
                </div>
            </div>
            <div className='chat-content'>

                {chatDataSource.length > 0 && chatDataSource.find(chat => chat.isActive) ? (
                    <ChatContainer item={chatDataSource.find(chat => chat.isActive)} setChatDataSource={setChatDataSource} />
                ) : (
                    <Introduction addNewChat={addNewChat} />
                )}

            </div>
        </div>
    );
};

export default ChatPage;