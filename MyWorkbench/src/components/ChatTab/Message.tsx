// components/ChatTab/Message.js
import React from 'react';
import { formatMarkdown } from '@/utils/markdownFormatter.ts';

interface MessageProps {
    content: string;
    sender: 'user' | 'bot';
    className?: string;
}

const Message = ({ content, sender, className }: MessageProps) => {
    const formattedContent = formatMarkdown(content);

    return (
            <div className={className}>
                <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                        sender === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-slate-100 text-gray-800 rounded-bl-none'
                    }`}
                >
                    <div className={`message ${sender}-message`}>
                    <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
                </div>
                </div>
            </div>
    );
};

export default Message;