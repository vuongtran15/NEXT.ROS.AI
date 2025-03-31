import { renderChatMessageWithLineBreaks } from "@/utils/chatUtils";

export function UserMessage({ message }) {
    return (<div key={message.id} className="message-container flex justify-end">
        <div className="message max-w-[70%] p-3 rounded-lg bg-blue-500 text-white rounded-tr-none">
            <div className="message-text">{renderChatMessageWithLineBreaks(message.text)}</div>
            {/* <div className="message-time text-xs mt-1 text-blue-100" >
                {formatChatMessageTime(message.timestamp)}
            </div> */}
        </div>
    </div>);
}
