'use client'

import mAxios from "@/app/utils/mAxios";
import TopBar from "@/components/topbar";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const TopBarHandler = React.memo(() => {
    const params = useParams();
    const appId = params.appId as string;
    let isAppFetching = false;
    const [appList, setAppList] = useState<Array<any>>([]);
    const [appPage, setAppPage] = useState(1);

    const getApps = async (page: number, overwrite: boolean) => {
        if (isAppFetching) return;
        try {
            isAppFetching = true;
            const { data: response } = await mAxios.get(`/apps?page=${page}`);
            const { data, page: currPage } = response;
            setAppList(overwrite ? data : appList.concat(data));
            setAppPage(currPage);
            isAppFetching = false;
        } catch (error) {
            isAppFetching = false;
            console.error(error);
        }
    }

    useEffect(() => {
        getApps(appPage, true);
    }, [appPage]);

    return <TopBar title="Dashboard" apps={appList} defaultAppId={appId} />
});

export default TopBarHandler;