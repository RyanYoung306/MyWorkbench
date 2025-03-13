import MessageList from './MessageList.tsx';
import MessageInput from './MessageInput.tsx';
import { ScrollArea } from "@/components/ui/scroll-area"

const MessageArea = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-hidden relative">
                <ScrollArea className="absolute inset-0 h-full w-full">
                    <MessageList />
                </ScrollArea>
            </div>
            <div className="shrink-0 py-3 px-4 border-t">
                <MessageInput />
            </div>
        </div>
    );
};

export default MessageArea;