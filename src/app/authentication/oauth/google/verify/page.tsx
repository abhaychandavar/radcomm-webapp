// This part is the client component
'use client';
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import config from '../../../../../config/config';
import styles from './verify.module.css';

const VerifyGoogleOauth = () => {
  const searchParams = useSearchParams();
  const navigation = useRouter();
  useEffect(() => {
    const verifyOauth = async () => {
      try {
        const params: Record<string, any> = {
          ...(Object.fromEntries(searchParams.entries()) || {})
        };

        const { data: authData } = await axios.get(`${config.apiBaseUrl}/auth/oauth/google/verify`, {
          params
        });

        const { accessToken, refreshToken } = authData.data;

        // Call the server-side API route to set cookies and handle the redirection
        await axios.post('/api/handle-auth', { accessToken, refreshToken });
        navigation.replace('/dashboard');
      } catch (error) {
        console.error('Error verifying OAuth:', error);
      }
    };

    verifyOauth();
  }, [searchParams]);

  return (
    <div className='w-full h-screen bg-orange-700 flex justify-center items-center'>
      <h1 className={`text-white ${styles.waveOpacity}`}>Verifying Auth...</h1>
    </div>
  );
};

export default VerifyGoogleOauth;
