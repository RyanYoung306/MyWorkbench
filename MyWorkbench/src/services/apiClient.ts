// services/apiClient.ts

// Define interfaces
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    updatedAt?: string;
}

export interface Model {
    id: string;
    [key: string]: any;
}

export interface ChatResponse {
    messages: ChatMessage[];
}

export interface HealthStatus {
    status: string;
    timestamp: string;
    details?: Record<string, any>;
}

/**
 * API Client for communicating with the Spring Boot backend
 */
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
    }

    /**
     * Set the base URL for API requests
     */
    setBaseUrl(url: string): void {
        this.baseUrl = url;
    }

    /**
     * Get available models from the backend
     */
    async getModels(): Promise<Model[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/models`);

            if (!response.ok) {
                throw new Error(`Failed to get models: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching models:', error);
            throw error;
        }
    }

    /**
     * Send a chat message to the LLM
     */
    async sendChatMessage(
        model: string | null,
        messages: ChatMessage[],
        temperature: number,
        maxTokens: number
    ): Promise<ChatResponse> {
        try {
            console.log('model:', messages);
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model,
                    messages,
                    temperature,
                    maxTokens
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending chat message:', error);
            throw error;
        }
    }

    /**
     * Get all chat history
     */
    async getChatHistory(): Promise<ChatSession[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat-history`);

            if (!response.ok) {
                throw new Error(`Failed to get chat history: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching chat history:', error);
            throw error;
        }
    }

    /**
     * Get a specific chat session by ID
     */
    async getChatById(chatId: string): Promise<ChatSession> {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat-history/${chatId}`);

            if (!response.ok) {
                throw new Error(`Failed to get chat: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching chat ${chatId}:`, error);
            throw error;
        }
    }

    /**
     * Save a chat session
     */
    async saveChat(chat: {
        id: string | null;
        title: string;
        messages: { role: string; content: string }[];
        updatedAt: string;
    }): Promise<ChatSession> {
        // If no id exists, remove it so that backend can auto-generate one.
        const payload = {
            ...chat,
            id: chat.id ? chat.id : undefined
        };

        try {
            const response = await fetch(`${this.baseUrl}/api/chat-history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Failed to save chat: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving chat:', error);
            throw error;
        }
    }

    /**
     * Delete a specific chat session
     */
    async deleteChat(chatId: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat-history/${chatId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete chat: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Error deleting chat ${chatId}:`, error);
            throw error;
        }
    }

    /**
     * Delete all chat sessions
     */
    async clearAllChats(): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat-history`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to clear chat history: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error clearing all chats:', error);
            throw error;
        }
    }

    /**
     * Check server health status
     */
    async checkHealth(): Promise<HealthStatus> {
        try {
            const response = await fetch(`${this.baseUrl}/api/health`);

            if (!response.ok) {
                throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }
}

const apiClient = new ApiClient();

export default apiClient;