import SettingsPanel from './SettingsPanel.tsx';
import { ChatProvider } from '../../contexts/ChatContent.tsx';
import ChatHistory from './ChatHistory.tsx';
import MessageArea from './MessageArea.tsx';

const ChatTab = () => {
    return (
        <ChatProvider>
            {/* Using Tailwind's responsive grid with min-width constraints */}
            <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)] px-4 overflow-x-hidden">
                {/* Left column - Settings Panel (3/12 = 25%) */}
                <div className="col-span-12 md:col-span-3 lg:col-span-3 overflow-y-auto">
                    <SettingsPanel />
                </div>

                {/* Middle column - Chat Messages and Input (6/12 = 50%) */}
                <div className="col-span-12 md:col-span-6 lg:col-span-6 overflow-hidden flex flex-col">
                    <MessageArea />
                </div>

                {/* Right column - Chat History (3/12 = 25%) */}
                <div className="col-span-12 md:col-span-3 lg:col-span-3 overflow-y-auto">
                    <div className="h-full border rounded-lg shadow-sm">
                        <ChatHistory />
                    </div>
                </div>
            </div>
        </ChatProvider>
    );
};


export default ChatTab;