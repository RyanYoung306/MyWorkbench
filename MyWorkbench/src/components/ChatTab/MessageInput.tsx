import React, { useState } from 'react';
import { useChat } from '../../contexts/ChatContent.tsx';
import { useConnection } from '../../contexts/ConnectionContext';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../ui/button.tsx';
import { Send } from 'lucide-react';

const MessageInput = () => {
    const [inputText, setInputText] = useState('');
    const { sendMessage, isLoading } = useChat();
    const { isConnected } = useConnection();

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (inputText.trim() && isConnected && !isLoading) {
            sendMessage(inputText);
            setInputText('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className=" p-4 ">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message here..."
                    disabled={!isConnected || isLoading}
                    className="min-h-[60px] resize-none"
                />
                <Button
                    type="submit"
                    disabled={!isConnected || !inputText.trim() || isLoading}
                    size="icon"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </form>
            <p className="text-xs text-slate-500 mt-2">Press Ctrl+Enter to send</p>
        </div>
    );
};

export default MessageInput;