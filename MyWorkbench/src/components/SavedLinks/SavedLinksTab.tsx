import { ChatProvider } from '../../contexts/ChatContent.tsx';

const ChatTab = () => {
    return (
        <ChatProvider>
            <div className="flex flex-col md:flex-row h-[calc(100vh-200px)]">
                <h1>Saved Links</h1>
            </div>
        </ChatProvider>
    );
};

export default ChatTab;