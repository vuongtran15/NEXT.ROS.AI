import React from "react";
import { InputControl } from "./inputControl";

export function Introduction({ addNewChat }) {
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
                <InputControl allowTyping={true} onMessageSend={msg => addNewChat(msg)} />
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