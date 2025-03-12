// contexts/ConnectionContext.tsx
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

// Define types
export interface Model {
    id: string;
    [key: string]: any;
}

interface ConnectionContextState {
    isConnected: boolean;
    isConnecting: boolean;
    apiUrl: string;
    models: Model[];
    selectedModel: string | null;
    temperature: number;
    maxTokens: number;
    connectionError: string | null;
}

interface ConnectionContextValue extends ConnectionContextState {
    connectToAPI: () => Promise<boolean>;
    disconnectFromAPI: () => void;
    setModelParameter: <K extends keyof ConnectionContextState>(param: K, value: ConnectionContextState[K]) => void;
}

// Create the context with a default value
const ConnectionContext = createContext<ConnectionContextValue | undefined>(undefined);

// Custom hook to use the context
export const useConnection = (): ConnectionContextValue => {
    const context = useContext(ConnectionContext);
    if (context === undefined) {
        throw new Error('useConnection must be used within a ConnectionProvider');
    }
    return context;
};

interface ConnectionProviderProps {
    children: ReactNode;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ children }) => {
    const [connectionState, setConnectionState] = useState<ConnectionContextState>({
        isConnected: false,
        isConnecting: false,
        apiUrl: 'http://localhost:8080',
        models: [],
        selectedModel: null,
        temperature: 0.7,
        maxTokens: 2048,
        connectionError: null
    });

    const connectToAPI = useCallback(async (): Promise<boolean> => {
        if (connectionState.isConnected || connectionState.isConnecting) return false;

        try {
            setConnectionState(prev => ({ ...prev, isConnecting: true, connectionError: null }));

            const response = await fetch(`${connectionState.apiUrl}/api/models`);

            if (!response.ok) {
                throw new Error(`Failed to connect: ${response.status} ${response.statusText}`);
            }

            const models = await response.json();

            setConnectionState(prev => ({
                ...prev,
                isConnected: true,
                isConnecting: false,
                models,
                selectedModel: models.length > 0 ? models[0].id : null
            }));

            return true;
        } catch (error) {
            setConnectionState(prev => ({
                ...prev,
                isConnected: false,
                isConnecting: false,
                connectionError: error instanceof Error ? error.message : 'An unknown error occurred'
            }));

            return false;
        }
    }, [connectionState.apiUrl, connectionState.isConnected, connectionState.isConnecting]);

    const disconnectFromAPI = useCallback(() => {
        setConnectionState(prev => ({
            ...prev,
            isConnected: false,
            isConnecting: false
        }));
    }, []);

    const setModelParameter = useCallback(<K extends keyof ConnectionContextState>(
        param: K,
        value: ConnectionContextState[K]
    ) => {
        setConnectionState(prev => ({
            ...prev,
            [param]: value
        }));
    }, []);

    const value: ConnectionContextValue = {
        ...connectionState,
        connectToAPI,
        disconnectFromAPI,
        setModelParameter
    };

    return (
        <ConnectionContext.Provider value={value}>
            {children}
        </ConnectionContext.Provider>
    );
};