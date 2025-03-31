import React, { useState, useRef } from "react";
import { HiMiniMicrophone } from "react-icons/hi2";
import { IoAttachSharp } from "react-icons/io5";

export function InputControl({ allowTyping = true, onMessageSend }) {
    const maxLength = 500;
    const cooldownTime = 5000; // 5 seconds in milliseconds
    const [charCount, setCharCount] = useState(0);
    const [cooldownActive, setCooldownActive] = useState(false);
    const [cooldownMessage, setCooldownMessage] = useState("");
    const inputRef = useRef(null);
    const cooldownTimerRef = useRef(null);

    // handle paste event to limit pasted text length
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
                    if (cooldownActive) {

                        if(cooldownMessage) return; // Prevents multiple messages if already showing

                        // Show warning message only when user tries to send during cooldown
                        const startTime = Date.now();
                        const updateCooldownMessage = () => {
                            const remaining = Math.ceil((cooldownTime - (Date.now() - startTime)) / 1000);
                            if (remaining > 0) {
                                setCooldownMessage(`Please wait ${remaining} seconds before sending another message.`);
                                setTimeout(updateCooldownMessage, 1000);
                            } else {
                                setCooldownMessage("");
                            }
                        };
                        updateCooldownMessage();
                        return;
                    }

                    sendMessage(message);
                    // Clear the input right after sending
                    if (inputRef.current) {
                        inputRef.current.innerText = '';
                        setCharCount(0);
                    }

                    // Set cooldown
                    setCooldownActive(true);

                    cooldownTimerRef.current = setTimeout(() => {
                        setCooldownActive(false);
                        //setCooldownMessage(""); // Clear any message when cooldown ends
                    }, cooldownTime);
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

    // Clean up timer on unmount
    React.useEffect(() => {
        return () => {
            if (cooldownTimerRef.current) {
                clearTimeout(cooldownTimerRef.current);
            }
        };
    }, []);

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
                    <span className={`text-xs ${charCount >= maxLength ? 'text-red-500' : 'text-gray-400'}`}>
                        {charCount}/{maxLength}
                    </span>
                    {cooldownMessage && (
                        <div className="text-xs text-red-500">{cooldownMessage}</div>
                    )}
                </div>
                <div className='right-items flex flex-row gap-3'>
                    <button
                        className={`action-btn p-1.5 rounded-full transition-colors text-gray-500 ${allowTyping ? 'hover:bg-gray-100 hover:text-gray-700' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={!allowTyping}
                    >
                        <IoAttachSharp size={18} />
                    </button>
                    <button
                        className={`action-btn p-1.5 rounded-full transition-colors text-gray-500 ${allowTyping ? 'hover:bg-gray-100 hover:text-gray-700' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={!allowTyping}
                    >
                        <HiMiniMicrophone size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
