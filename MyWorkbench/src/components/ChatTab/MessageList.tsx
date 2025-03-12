// components/ChatTab/MessageList.js
import React, { useEffect, useRef } from 'react';
import Message from './Message.tsx';
import { useChat } from '../../contexts/ChatContent.tsx';
import { Loader2 } from 'lucide-react';

const MessageList = () => {
    const { messages, isLoading } = useChat();
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-messages p-4 space-y-4">
            {messages.map(message => (
                <Message
                    key={message.id}
                    content={message.content}
                    sender={message.sender}
                    className={message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}
                />
            ))}

            {isLoading && (
                <div className="message bot-message flex items-center bg-slate-100 p-3 rounded-lg max-w-[100%]">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Thinking...
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;