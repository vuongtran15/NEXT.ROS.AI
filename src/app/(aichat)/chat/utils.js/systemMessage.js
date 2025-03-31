
import { renderChatMessageWithLineBreaks } from "@/utils/chatUtils";

export function SystemMessage({ message }) {
    return (<div key={message.id} className="message-container flex justify-start" >
        <div className="message max-w-[70%] p-3 rounded-lg bg-gray-200 text-gray-800 rounded-tl-none" >
            <div className="message-text">{renderChatMessageWithLineBreaks(message.text)}</div>
            {/* <div className="message-time text-xs mt-1 text-gray-500" >
                {formatChatMessageTime(message.timestamp)}
            </div> */}
        </div>
    </div>);
}
