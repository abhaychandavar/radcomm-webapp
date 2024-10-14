'use client';

import mAxios from "@/app/utils/mAxios";
import Dropdown from "@/components/dropdown";
import { DataTable } from "@/components/table";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { LoaderIcon, Trash2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import DeleteApiKeyModal from "./components/deleteApiKeyModal";
import moment from "moment-timezone";

type ApiKeys = {
    id: string,
    type: string,
    host: string,
    value: string,
    priority?: number,
    ttl?: string,
    record: string
    status: string
}

const ApiKeys = ({ parameters }: { parameters?: Record<string, any>}) => {
    const [isApiKeyCreating, setIsApiKeyCreating] = useState(false);
    const [apiKeyToDelete, setApiKeyToDelete] = useState<string | null>(null);
    const [currDataLength, setCurrDataLength] = useState(-1);
    const [resetDataTable, setResetDataTable] = useState(true);

    const columns: ColumnDef<ApiKeys>[] = [
        {
            accessorKey: "apiKey",
            header: () => <div>Key</div>,
            cell: ({ row }) => (
                <div className="text-muted-foreground flex items-center">{row.getValue('apiKey')} <Mail className='ml-2 w-4 hover:text-white transition-all cursor-pointer'/></div>
            ),
            id: 'apiKey'
        },
        {
            accessorKey: "createdAt",
            header: () => <div>Created At</div>,
            cell: ({ row }) => <div className="text-muted-foreground">{moment.tz(row.getValue('createdAt'), moment.tz.guess()).format('DD MM YYYY, h:mm:ss A')}</div>,
            id: 'createdAt'
        },
        {
            accessorKey: "options",
            header: () => <div></div>,
            cell: ({ row }) => (
                <Dropdown triggerElement={
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                } items={[
                    {
                        key: 'delete',
                        title: 'Delete',
                        variant: 'destructive',
                        icon: <Trash2 className="mr-2 h-4 w-4" />
                    }
                ]}
                onMenuItemClick={(key) => {
                    if (key === 'delete') {
                        setApiKeyToDelete(row.getValue('apiKey'))
                    }
                }}
                menuLabel="Options"/>
            ),
        },
    ]
    const [apiKeys, setApiKeys] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(-1);
    const getApiKeys = async (page: number, pageSize: number) => {
        try {
            const { data: apiKeyData } = await mAxios.get('/apps/api/keys');
            console.log('apiKeyData.data.records', apiKeyData.data.records);
            const apiKeys = apiKeyData.data.records.map((apiData: Record<string, any>) => ({ apiKey: apiData.key, keyId: apiData.id, createdAt: apiData.createdAt }));
            if (page > currentPage) {
                setCurrentPage(page + 1);
                setCurrDataLength(currDataLength < 0 ? apiKeys.length : currDataLength + apiKeys.length);
            }
            setApiKeys(apiKeys);
            return apiKeys;
        }
        catch (error) {
            console.error('get api keys error', error);
            setApiKeys([]);
            return [];
        }
    }

    useEffect(() => {
        if (resetDataTable) setResetDataTable(false);
    }, [resetDataTable])

    const createApiKey = async () => {
        try {
            setIsApiKeyCreating(true)
            await mAxios.post('/apps/api/keys');
            setResetDataTable(true);
            setCurrentPage(-1);
            setCurrDataLength(0);
        }
        catch (error) {
            console.error('Requested API key', error);
        }
        finally {
            setIsApiKeyCreating(false);
        }
    }
    useEffect(() => {
        getApiKeys(1, 50);
    }, [])
    return (
        <main className="w-full h-full flex flex-col gap-5">
            <h1 className="text-3xl">API Keys</h1>
            <DeleteApiKeyModal apiKey={apiKeyToDelete as string} isOpen={apiKeyToDelete !== null} onClose={(isSuccess?: boolean) => {
                setApiKeyToDelete(null);
                if (isSuccess) {
                    setResetDataTable(true);
                    setCurrentPage(-1);
                    setCurrDataLength(0);
                }
            }} />
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">API keys let you access RadApp APIs, ensure that API secret is not revealed</p>
                <Button variant={currDataLength < 0 ? 'outline' : currDataLength > 0 ? 'outline' : 'default'} disabled={currDataLength >= 10 || currDataLength< 0} className="w-fit" onClick={createApiKey}>{isApiKeyCreating ? <LoaderIcon className="w-4 h-4 animate-spin mr-2" /> : <></>}Get new API Key</Button>
            </div>
            <DataTable columns={columns} 
             
            data={apiKeys}/>
        </main>
    )
}

export default ApiKeys;