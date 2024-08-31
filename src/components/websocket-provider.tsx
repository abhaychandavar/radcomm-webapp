'use client';

import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import WebSocketClient from '../services/websocket';
import helpers from '@/app/utils/helpers';
import { handleWebsocketMessage } from '@/services/utils';
import { useState } from 'react';
import axios from 'axios';
import authService from '@/services/auth';

// Define the context type
interface WebSocketContextType {
  sendMessage: (message: string) => void;
  message: Record<string, any> | null;
  isConnectionOpen: boolean;
}

// Create the WebSocket context
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// WebSocket Provider component
interface WebSocketProviderProps {
  url: string;
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ url, children }) => {
  const wsClient = useRef<WebSocketClient | null>(null);
  const [message, setMessage] = useState<Record<string, any> | null>(null);
  const [isConnectionOpen, setIsConnectionOpen] = useState(false);
  useEffect(() => {
    const connectWs = async () => {
        await authService.getSelf();
        wsClient.current = new WebSocketClient(url, (data) => {
            setMessage(data as Record<string, any>);
        }, () => {
            setIsConnectionOpen(true);
        });
        const { data } = await axios.get('/api/handle-auth');
        wsClient.current.connect(data.accessToken || undefined);
        
        return () => {
            wsClient.current?.disconnect();
        };
    }
    connectWs();
  }, [url]);

  const sendMessage = (message: string) => {
    console.log('MESSAGE', message)
    wsClient.current?.sendMessage(message);
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, message, isConnectionOpen }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
