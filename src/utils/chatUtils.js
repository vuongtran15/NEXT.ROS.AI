// Format chat message timestamp to hour:minute format
export const formatChatMessageTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Convert new line characters in chat messages to <br> elements for proper display
export const renderChatMessageWithLineBreaks = (text) => {
    // Parse markdown and convert to HTML
    const parseMarkdown = (text) => {
        // Convert headings: # Heading, ## Heading, etc.
        text = text.replace(/^(#{1,6})\s+(.*?)$/g, (match, hashes, content) => {
            const level = hashes.length;
            return `<h${level}>${content}</h${level}>`;
        });
        
        // Convert bold: **text** to <strong>text</strong>
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convert italic: *text* to <em>text</em>
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Convert code: `code` to <code>code</code>
        text = text.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Convert links: [text](url) to <a href="url">text</a>
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        
        return text;
    };
    
    // Limit consecutive newlines to maximum of 2
    const normalizedText = text.replace(/\n{3,}/g, '\n\n');
    
    return normalizedText.split('\n').map((line, i) => (
        <div key={i}>
            <span dangerouslySetInnerHTML={{ __html: parseMarkdown(line) }} />
            {i < normalizedText.split('\n').length - 1 && <br />}
        </div>
    ));
};
