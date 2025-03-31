// Format chat message timestamp to hour:minute format
export const formatChatMessageTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Convert new line characters in chat messages to <br> elements for proper display
export const renderChatMessageWithLineBreaks = (text) => {
    return text.split('\n').map((line, i) => (
        <span key={i}>
            {line}
            {i < text.split('\n').length - 1 && <br />}
        </span>
    ));
};
