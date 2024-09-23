'use client';

import mAxios from "../utils/mAxios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Dashboard = () => {
    const router = useRouter();
    useEffect(() => {
        const redirect = async () => {
            const { data: response } = await mAxios.get(`/apps?page=1`);
            const { data } = response;
            const { data: cachedAppId } = await axios.get('/api/apps');
            console.log('data', data);
            if (!data?.length) {
                return router.replace('/create-app');
            }
            const appId = (data as Array<Record<string, any>>).find((a) => a.id === cachedAppId.appId) || data[0].id;
            await axios.post('/api/apps', { appId });
            localStorage.setItem('appId', appId);
            return router.replace(`/dashboard/${appId}/domains`);
        }
        redirect();
    }, []);

    return <></>
}

export default Dashboard;