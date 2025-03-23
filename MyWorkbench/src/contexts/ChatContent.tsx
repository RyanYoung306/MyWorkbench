// contexts/ChatContext.tsx
import React, { createContext, useState, useContext, useCallback, useEffect, ReactNode } from 'react';
import { useConnection } from './ConnectionContext';
import apiClient from '@/services/apiClient';

// Define types
export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp?: string;
}

export interface ApiMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatHistoryItem {
    id: string;
    title: string;
    updatedAt: string;
}

interface ChatContextValue {
    messages: Message[];
    isLoading: boolean;
    chatHistory: ChatHistoryItem[];
    currentChatId: string | null;
    addMessage: (content: string, sender: Message["sender"]) => Message;
    sendMessage: (content: string) => Promise<void>;
    createNewChat: () => string;
    loadChatHistoryById: (chatId: string) => Promise<void>;
    deleteChatHistory: (chatId: string) => Promise<void>; // changed here from string | number to string
    clearAllChatHistories: () => Promise<void>;
    loadChatHistoryList: () => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const useChat = (): ChatContextValue => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const {
        isConnected,
        apiUrl,
        selectedModel,
        temperature,
        maxTokens
    } = useConnection();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'initial-message',
            content: 'Hello! I\'m your local DeepSeek assistant. Connect to a local DeepSeek instance to start chatting.',
            sender: 'bot'
        }
    ]);

    const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Initialize a new chat when the component mounts
    useEffect(() => {
        createNewChat();
    }, []);

    // Load chat history when connection status changes
    useEffect(() => {
        if (isConnected) {
            loadChatHistoryList();
        }
    }, [isConnected]);

    const addMessage = useCallback((content: string, sender: Message['sender']): Message => {
        const newMessage: Message = {
            id: Date.now().toString(),
            content,
            sender,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMessage]);
        return newMessage;
    }, []);

    const sendMessage = useCallback(async (content: string): Promise<void> => {
        if (!content.trim() || !isConnected) return;

        // Add user message to chat
        const userMessage = addMessage(content, 'user');

        // Show loading state
        setIsLoading(true);

        try {
            // Prepare messages for API
            const apiMessages: ApiMessage[] = messages
                .filter(msg => !msg.hasOwnProperty('isLoading'))
                .slice(-10) // Get last 10 messages for context
                .map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.content
                }));

            // Add current message
            apiMessages.push({
                role: 'user',
                content
            });

            // Call API using ApiClient
            const data = await apiClient.sendChatMessage(
                selectedModel,
                apiMessages,
                temperature,
                maxTokens
            );

            // Add bot response based on returned data
            let botMessage;
            if (data.messages && data.messages.length > 0) {
                botMessage = addMessage(data.messages[0].content, 'bot');
            } else {
                botMessage = addMessage("No response received from the model.", 'bot');
            }

            // Create a complete message array that includes both the new user message and bot response
            const updatedMessages = [...messages, userMessage, botMessage].filter(
                msg => !msg.hasOwnProperty('isLoading')
            );

            // Generate title
            const firstUserMsg = updatedMessages.find(msg => msg.sender === 'user');
            const title =
                firstUserMsg && firstUserMsg.content.length > 30
                    ? firstUserMsg.content.substring(0, 30) + '...'
                    : firstUserMsg
                        ? firstUserMsg.content
                        : 'New Chat';

            // Prepare chat session with updated messages
            const chatSession = {
                id: currentChatId,
                title,
                messages: updatedMessages.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.content
                })),
                updatedAt: new Date().toISOString()
            };

            // Save chat history using ApiClient
            await apiClient.saveChat(chatSession);
            await loadChatHistoryList();


        } catch (error) {
            addMessage(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`, 'bot');
        } finally {
            setIsLoading(false);
        }
    }, [isConnected, messages, apiUrl, selectedModel, temperature, maxTokens, addMessage]);

    const createNewChat = useCallback((): string => {
        const newChatId = 'chat_' + Date.now();
        setCurrentChatId(newChatId);

        // Clear existing messages to start a new chat session
        setMessages([
            {
                id: 'initial-message',
                content: 'Hello! I\'m your local DeepSeek assistant. Connect to a local DeepSeek instance to start chatting.',
                sender: 'bot'
            }
        ]);


        return newChatId;
    }, [setCurrentChatId, setMessages]);

    const loadChatHistoryList = useCallback(async () => {
        if (!isConnected) return;

        try {
            const response = await fetch(`${apiUrl}/api/chat-history`);

            if (!response.ok) {
                throw new Error(`Failed to load chat history: ${response.status}`);
            }

            const chatSessions = await response.json();
            setChatHistory(chatSessions);
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }, [isConnected, apiUrl]);

    const loadChatHistoryById = useCallback(async (chatId: string): Promise<void> => {
        if (!isConnected) return;

        try {
            const response = await fetch(`${apiUrl}/api/chat-history/${chatId}`);

            if (!response.ok) {
                throw new Error(`Failed to load chat: ${response.status}`);
            }

            const chat = await response.json();

            if (!chat) {
                throw new Error("Received empty chat data");
            }

            // Set as current chat
            setCurrentChatId(chat.id);

            // Convert messages format
            const formattedMessages: Message[] = chat.messages.map((msg: ApiMessage & { id?: string, timestamp?: string}) => ({
                id: msg.id || `${Date.now()}-${Math.random()}`,
                content: msg.content,
                sender: msg.role === 'user' ? 'user' : 'bot',
                timestamp: msg.timestamp || new Date().toISOString()
            }));

            // Update messages
            setMessages(formattedMessages);

            // Refresh history list to show active chat
            loadChatHistoryList();
        } catch (error) {
            console.error('Error loading chat:', error);
            setMessages([{
                id: 'error-message',
                content: `Error loading chat history: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
                sender: 'bot'
            }]);
        }
    }, [isConnected, apiUrl, loadChatHistoryList]);

    // const saveCurrentChat = useCallback(async (): Promise<void> => {
    //
    //     if (!isConnected || !currentChatId) {
    //         console.log("Not saving chat: Not connected or no current chat ID");
    //         return;
    //     }
    //
    //     // if (messages.length <= 1) {
    //     //     console.log("Not saving chat: Too few messages", messages);
    //     //     return;
    //     // }
    //
    //     try {
    //         // Generate title from first user message
    //         let title = 'New Chat';
    //         const firstUserMsg = messages.find(msg => msg.sender === 'user');
    //         if (firstUserMsg) {
    //             title = firstUserMsg.content.length > 30
    //                 ? firstUserMsg.content.substring(0, 30) + '...'
    //                 : firstUserMsg.content;
    //         }
    //
    //         // Format messages for API
    //         const apiMessages: ApiMessage[] = messages.map(msg => ({
    //             role: msg.sender === 'user' ? 'user' : 'assistant',
    //             content: msg.content
    //         }));
    //
    //         // Send to backend
    //         await fetch(`${apiUrl}/api/chat-history`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 id: currentChatId,
    //                 title,
    //                 messages: apiMessages
    //             })
    //         });
    //
    //         // Refresh history
    //         loadChatHistoryList();
    //     } catch (error) {
    //         console.error('Error saving chat history:', error);
    //     }
    // }, [isConnected, apiUrl, currentChatId, messages, loadChatHistoryList]);

    const deleteChatHistory = useCallback(async (chatId: string): Promise<void> => {
        try {
            await fetch(`${apiUrl}/api/chat-history/${chatId}`, {
                method: 'DELETE'
            });

            // Reload the chat history list
            loadChatHistoryList();

            // If the current chat was deleted, create a new one
            if (chatId === currentChatId) {
                createNewChat();
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    }, [apiUrl, currentChatId, createNewChat, loadChatHistoryList]);

    const clearAllChatHistories = useCallback(async (): Promise<void> => {
        try {
            await fetch(`${apiUrl}/api/chat-history`, {
                method: 'DELETE'
            });

            // Reload the chat history list
            loadChatHistoryList();

            // Create a new chat
            createNewChat();
        } catch (error) {
            console.error('Error deleting all chats:', error);
        }
    }, [apiUrl, createNewChat, loadChatHistoryList]);

    const contextValue: ChatContextValue = {
        messages,
        isLoading,
        chatHistory,
        currentChatId,
        addMessage,
        sendMessage,
        createNewChat,
        loadChatHistoryById,
        deleteChatHistory,
        clearAllChatHistories,
        loadChatHistoryList
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
};