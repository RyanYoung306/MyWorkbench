// components/ChatTab/ChatContainer.js
import React from 'react';
import ChatHistory from './ChatHistory.tsx';
import MessageArea from './MessageArea.tsx';
import { Card } from '../ui/card.tsx';

const ChatContainer = () => {
    return (
        <Card className="w-full  h-[80vh] flex flex-col md:flex-row-reverse overflow-hidden">
            <div className="md:w-1/4 w-full">
                <ChatHistory />
            </div>
            <div className="md:w-3/4 w-full flex-grow">
                <MessageArea />
            </div>
        </Card>
    );
};

export default ChatContainer;
