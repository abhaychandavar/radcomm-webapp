import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import appConfig from '../../config/config';
import config from '../../config/config';
import moment from 'moment-timezone';
// Create an instance of axios
const mAxios = axios.create();

// Function to refresh the access token
async function refreshAccessToken() {
    const refreshToken = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1] : localStorage?.getItem('refreshToken');

    // Make a request to your token refresh endpoint
    const { data: response } = await axios.post(`${config.apiBaseUrl}/auth/refresh`, { token: refreshToken });

    // Assuming the new access token is returned in response.data.access_token
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    await axios.post('/api/handle-auth', { accessToken, refreshToken: newRefreshToken });

    // Store the new access token in localStorage
    // localStorage.setItem('accessToken', accessToken);
    // localStorage.setItem('refreshToken', newRefreshToken);

    return {
        accessToken,
        refreshToken: newRefreshToken
    };
}

// Add a request interceptor to include the access token from localStorage
mAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] : localStorage?.getItem('accessToken');
    const appId = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('appId='))?.split('=')[1] : localStorage?.getItem('appId');
    config.baseURL = appConfig.apiBaseUrl;
    config.withCredentials = true;
    config.headers['timezone'] = moment.tz.guess();
    if (appId) {
        config.headers['app-id'] = appId;
    }
    if (token && config.headers && !config.headers['Authorization']) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor to handle token refreshing
mAxios.interceptors.response.use((response) => {
    return response;
}, async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if ([401, 403].includes(error.response?.status || 500) && !originalRequest._retry) {
        console.log('Refreshing access token and retrying the request');
        originalRequest._retry = true;

        try {
            // Attempt to refresh the access token
            const { accessToken } = await refreshAccessToken();
            console.log('refreshed access token', accessToken);
            // Update the Authorization header with the new token
            if (originalRequest.headers) {
                originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
            }

            // Retry the original request with the new token
            const res = await axios(originalRequest);
            return res;
        } catch (refreshError) {
            // Handle refresh token failure (e.g., logout user)
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default mAxios;
