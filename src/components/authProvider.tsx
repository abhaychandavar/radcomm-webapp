'use client';

import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import WebSocketClient from '../services/websocket';
import helpers from '@/app/utils/helpers';
import { handleWebsocketMessage } from '@/services/utils';
import { useState } from 'react';
import axios from 'axios';
import authService from '@/services/auth';
import mAxios from '@/app/utils/mAxios';

// Define the context type
interface AuthContextType {
  auth: Record<string, any> | null;
}

// Create the WebSocket context
const AuthProviderContext = createContext<AuthContextType | undefined>(undefined);

// WebSocket Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const data: Record<string, any> = {
        user: {},
        appId: null,
        tokens: {}
      };
      const self = await authService.getSelf();
      data.user = self;

      const appId = localStorage.getItem('appId');
      
      data.appId = appId;

      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      data.tokens = {
        accessToken: accessToken,
        refreshToken: refreshToken
      }

      console.log('auth', data);
      setAuth(data);
    }
    getUser();
  }, []);

  return (
    <AuthProviderContext.Provider value={{ auth }}>
      {children}
    </AuthProviderContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useAuthDetails = (): AuthContextType => {
  const context = useContext(AuthProviderContext);
  if (!context) {
    throw new Error('useAuthDetails must be used within a AuthProvider');
  }
  return context;
};
