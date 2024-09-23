'use client';

import { useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AddDomainModal from "./addDomainModal";
import mAxios from "@/app/utils/mAxios";
import { Badge } from "@/components/ui/badge";
import { Globe2, Trash2 } from "lucide-react";
import Dropdown from "@/components/dropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import helpers from "@/app/utils/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table";

type DomainListCols = {
    key: string,
    domain: string,
    status: string,
    region: {
        name: string,
        icon: string,
        countryCode: string,
        code: string
    },
    createdAt: string
}

const DomainList = () => {
    const pathName = usePathname();
    const [domains, setDomains] = useState<Array<
        {
            key: string,
            domain: string,
            status: string,
            region: {
                name: string,
                icon: string,
                countryCode: string,
                code: string
            },
            createdAt: string
        }
    >>([]);
    const [isListFetching, setIsListFetching] = useState(true);

    const columns: ColumnDef<DomainListCols>[] = [

        {
            accessorKey: "domain",
            header: () => <div>Domain</div>,
            cell: ({ row }) => {
                const domain = row.original;
                const redirectPath = `${pathName}/${domain.key}`;

                return (<div className={`font-bold text-lg bg-gradient-to-r ${domain?.status === 'verifying' ? 'animate-pulse' : ''} ${domain?.status === 'verified' ? 'from-green-500 to-sky-500' : domain?.status === 'failed' ? 'from-red-500 to-destructive-background' : 'from-primary to-yellow-400'} bg-clip-text text-transparent transition-all`}><Link href={redirectPath} className="flex items-center gap-2">
                    <span className={`${domain?.status === 'verifying' ? 'animate-pulse' : ''} ${domain?.status === 'verified' ? 'text-green-500' : domain?.status === 'failed' ? 'text-destructive' : domain?.status === 'verifying' ? 'text-primary' : 'text-muted-foreground'}`}><Globe2 /></span>{domain?.domain || ''}</Link>
                </div>)
            },
            id: 'domain'
        },
        {
            accessorKey: "status",
            header: () => <div>Status</div>,
            cell: ({ row }) => {
                const domain = row.original;
                return <div><Badge className={`cursor-default ${domain?.status === 'verified' ? 'bg-green-500 text-white' : domain?.status === 'verified' ? 'text-white' : ''}`} variant={domain?.status === 'verified' ? 'default' : domain?.status === 'failed' ? 'destructive' : 'outline'}>{domain?.status}</Badge></div>
            },
            id: 'status'
        },
        {
            accessorKey: "region",
            header: () => <div>Region</div>,
            cell: ({ row }) => {
                const domain = row.original;
                return <div className='text-muted-foreground flex gap-2'>{domain?.region.countryCode ? helpers.getFlagIcon(domain.region.countryCode) : <></>}{`${domain?.region.name} (${domain?.region.code})`}</div>
            },
        },
        {
            accessorKey: "createdAt",
            header: () => <div>Created At</div>,
            cell: ({ row }) => {
                const domain = row.original;
                return <div className='text-muted-foreground flex gap-2'>{domain?.createdAt}</div>
            },
        },
        {
            accessorKey: "options",
            header: () => <></>,
            cell: ({ row }) => {
                const domain = row.original;
                return <Dropdown triggerElement={
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
                    menuLabel="Options" />
            },
        },
    ];

    let isDomainsFetching = false;

    const fetchDomains = async (page?: number, perPage?: number, search?: string) => {
        try {
            if (isDomainsFetching) return;
            isDomainsFetching = true;
            const { data: domains } = await mAxios.get(`/mailer/onboard/apps/:appId/domains?page=${page || 1}&perPage=${perPage || 10}&search=${search || ''}`);
            if (domains.data.records.length) {
                setDomains(domains.data.records.map((domain: any) => {
                    return {
                        domain: domain.domainName,
                        status: domain.status,
                        region: { name: domain.region.name, icon: domain.region?.icon, countryCode: domain.region.countryCode, code: domain.region.code },
                        key: domain.domain._id,
                        createdAt: domain.createdAt
                    }
                }));
            }
            else {
                throw new Error('No domains found');
            }
        }
        catch (error) {
            console.error('Fetch domains error', error);
            setIsListFetching(false);
            return [];
        }
    }
    useEffect(() => {
        fetchDomains();
    }, []);

    useEffect(() => {
        if (domains.length)
            setIsListFetching(false);
    }, [domains]);

    if (isListFetching) {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Domain</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Skeleton className="h-8 w-full" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-8 w-full" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-8 w-full" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-8 w-full" />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }
    if (!domains.length) return (
        <Card className="w-full min-w-fit">
            <CardHeader>
                <CardTitle className="text-foreground">Add domain to start sending emails from your domain</CardTitle>
                <CardDescription>You will need to verify added domain by adding provided DNS records</CardDescription>
            </CardHeader>
            <CardContent>
                <AddDomainModal />
            </CardContent>
        </Card>
    );
    return (
        <main className="flex flex-col gap-5">
            <AddDomainModal buttonVariant={'outline'}/>
            <DataTable columns={columns} data={domains} pagination={true}/>
        </main>
    );
}

export default DomainList;