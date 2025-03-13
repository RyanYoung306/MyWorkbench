import { useChat } from '../../contexts/ChatContent.tsx';
import { Button } from '../ui/button.tsx';
import { PlusCircle, Trash2, X } from 'lucide-react';
import {useEffect} from "react";

const ChatHistory = () => {
    const {
        chatHistory,
        currentChatId,
        createNewChat,
        loadChatHistoryById,
        deleteChatHistory,
        clearAllChatHistories,
        loadChatHistoryList
    } = useChat();

    useEffect(() => {
        loadChatHistoryList();
    }, [loadChatHistoryList]);

    const handleDeleteClick = (e: React.MouseEvent, chatId: string | number) => {
        e.stopPropagation();
        if (window.confirm('Delete this conversation?')) {
            deleteChatHistory(chatId);
        }
    };

    const handleClearAllClick = () => {
        if (window.confirm('Are you sure you want to delete all chat histories?')) {
            clearAllChatHistories();
        }
    };

    return (
        <div className="chat-history-container">
            <div className="chat-history-header">
                <h3 className="text-sm font-semibold">Chat History</h3>
                <div className="flex gap-1 w-full">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={createNewChat}
                        className="flex items-center flex-1 justify-center"
                    >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        New
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAllClick}
                        className="flex items-center flex-1 justify-center"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear
                    </Button>
                </div>
            </div>

            <div className="chat-history-list">
                {!chatHistory || chatHistory.length === 0 ? (
                    <div className="text-center text-sm text-slate-500 py-6">No saved conversations</div>
                ) : (
                    chatHistory.map(chat => (
                        <div
                            key={chat.id}
                            className={`chat-history-item ${chat.id === currentChatId ? 'active' : ''}`}
                            onClick={() => loadChatHistoryById(chat.id)}
                        >
                            <div className="chat-title">{chat.title || "Untitled"}</div>
                            <div className="chat-date">
                                {chat.updatedAt ? new Date(chat.updatedAt).toLocaleString() : "No date"}
                            </div>
                            <button
                                className="delete-chat-btn"
                                onClick={(e) => handleDeleteClick(e, chat.id)}
                                aria-label="Delete chat"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatHistory;