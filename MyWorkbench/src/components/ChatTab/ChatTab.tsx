// components/ChatTab/ChatTab.js
import React from 'react';
import SettingsPanel from './SettingsPanel.tsx';
import ChatContainer from './ChatContainer.tsx';
import { ChatProvider } from '../../contexts/ChatContent.tsx';

const ChatTab = () => {
    return (
        <ChatProvider>
            <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-200px)]">
                <SettingsPanel />
                <ChatContainer />
            </div>
        </ChatProvider>
    );
};

export default ChatTab;