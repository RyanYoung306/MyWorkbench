import { useChat } from '../../contexts/ChatContent.tsx';
import { Button } from '../ui/button.tsx';
import { PlusCircle, Trash2, X, MessageSquare } from 'lucide-react';
import { useEffect } from "react";
import { ScrollArea } from '../ui/scroll-area';
import { useTheme } from '../theme-provider';

const ChatHistory = () => {
    const { theme } = useTheme();
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-3 dark:text-slate-200">Conversations</h3>
                <div className="flex gap-2">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={createNewChat}
                        className="flex items-center flex-1 justify-center"
                    >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        New Chat
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAllClick}
                        className="flex items-center justify-center"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2">
                    {!chatHistory || chatHistory.length === 0 ? (
                        <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
                            <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                            <p>No saved conversations</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {chatHistory.map(chat => (
                                <div
                                    key={chat.id}
                                    className={`p-3 rounded-md cursor-pointer transition-colors group relative
                                        ${chat.id === currentChatId
                                        ? theme === 'dark'
                                            ? 'bg-slate-800 hover:bg-slate-700'
                                            : 'bg-slate-200 hover:bg-slate-300'
                                        : theme === 'dark'
                                            ? 'hover:bg-slate-800'
                                            : 'hover:bg-slate-100'}`}
                                    onClick={() => loadChatHistoryById(chat.id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="truncate font-medium dark:text-slate-200">
                                            {chat.title || "Untitled Chat"}
                                        </div>
                                        <button
                                            className={`opacity-0 group-hover:opacity-100 ml-2 transition-opacity p-1 rounded 
                                                ${theme === 'dark'
                                                ? 'hover:bg-slate-700'
                                                : 'hover:bg-slate-200'}`}
                                            onClick={(e) => handleDeleteClick(e, chat.id)}
                                            aria-label="Delete chat"
                                        >
                                            <X className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                        </button>
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        {chat.updatedAt ? formatDate(chat.updatedAt) : "No date"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ChatHistory;