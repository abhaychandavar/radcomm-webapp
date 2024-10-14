'use client';

import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import config from '../config/config';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { LoaderIcon } from 'lucide-react';
import authService from '@/services/auth';

interface RealtimeContextType {
  channelName: string;
}

// Create the WebSocket context
const RealtimeProviderContext = createContext<RealtimeContextType | undefined>(undefined);

export default function RealtimeProvider(
  {
    children,
  }: {
    children: React.ReactNode,
  }
) {
  const [client, setClient] = useState<any | null>(null);
  const [channelName, setChannelName] = useState<string | null>(null);

  useEffect(() => {
    const initClient = async () => {
      const { data: tokens } = await axios.get(`${config.url}/api/handle-auth`);
      const { accessToken } = tokens;

      const appId = localStorage.getItem('appId');
      
      const c = new Ably.Realtime({ authUrl: `${config.apiBaseUrl}/realtime/token?raw=true&accessToken=${accessToken}&appId=${appId}` });
      setClient(c);

      const { user } = await authService.getSelf();

      console.log('user', user);
      const channelName = `${user.id}${appId}`;
      console.log('channelName', channelName);
      setChannelName(channelName);
    }
    initClient();
  }, []);

  if (!client || !channelName) {
    return <div className="w-full h-full flex items-center justify-center">
      <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
    </div>
  }
  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={channelName}><RealtimeProviderContext.Provider value = { { channelName } }>{children}</RealtimeProviderContext.Provider></ChannelProvider>
    </AblyProvider>
  );
}

export const useRealtimeDetails = (): RealtimeContextType => {
  const context = useContext(RealtimeProviderContext);
  if (!context) {
    throw new Error('useRealtimeDetails must be used within a RealtimeProvider');
  }
  return context;
};