'use client';

import mAxios from "@/app/utils/mAxios";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moment from 'moment-timezone';
import { Clock, LoaderIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table";
import { ColumnDef } from "@tanstack/react-table";
import CopyToClipboard from "@/components/copyToClipboard";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Dropdown from "@/components/dropdown";
import helpers from "@/app/utils/helpers";
import { Switch } from "@/components/ui/switch";
import Select from "@/components/select";
import { useToast } from "@/components/ui/use-toast";

const DomainDetails = ({ domainId }: { domainId: string }) => {
    const [domainDetails, setDomainDetails] = useState<Record<string, any>>();
    const router = useRouter();
    const { toast } = useToast();
    const [isOpenTrackingEnabled, setIsOpenTrackingEnabled] = useState(false);
    const [isClickTrackingEnabled, setIsClickTrackingEnabled] = useState(false);

    const getGroupedRecords = (records: Array<any>) => {
        const recordGroups: Record<string, any> = {};
        for (const domainRecord of records) {
            if (!recordGroups[domainRecord.record]) recordGroups[domainRecord.record] = [];
            recordGroups[domainRecord.record].push(domainRecord);
        }

        return recordGroups;
    }

    type DNSRecord = {
        id: string,
        type: string,
        host: string,
        value: string,
        priority?: number,
        ttl?: string,
        record: string
        status: string
    }

    const columns: ColumnDef<DNSRecord>[] = [
        {
            accessorKey: "type",
            header: () => <div>Type</div>,
            cell: ({ row }) => (
                <div className="text-left font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-40 min-w-40">{row.getValue("type")}</div>
            ),
        },
        {
            accessorKey: "name",
            header: () => <div>Host/Name</div>,
            cell: ({ row }) => (
                <div className="text-left font-medium flex flex-row gap-2 items-center min-w-40 max-w-40">
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[80%]">{row.getValue('name')}</div>
                    <CopyToClipboard value={row.getValue('name')} />
                </div>
            ),
        },
        {
            accessorKey: "value",
            header: () => <div >Value</div>,
            cell: ({ row }) => {
                return <div className="text-left font-medium flex flex-row gap-2 items-center min-w-40 max-w-40">
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[80%]">{row.getValue('value')}</div>
                    <CopyToClipboard value={row.getValue('value')} />
                </div>
            },
        },
        {
            accessorKey: "priority",
            header: () => <div >Priority</div>,
            cell: ({ row }) => (
                <div className="text-left font-medium whitespace-nowrap overflow-hidden text-ellipsis  min-w-40 max-w-40">{row.getValue("priority")}</div>
            ),
        },
        {
            accessorKey: "ttl",
            header: () => <div >TTL</div>,
            cell: ({ row }) => (
                <div className="text-left font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-40">{row.getValue("ttl")}</div>
            ),
        },
        {
            accessorKey: "status",
            header: () => <div >Status</div>,
            cell: ({ row }) => (
                <div className="text-left font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-40"><Badge variant={row.getValue('status') === 'verified' ? 'default' : row.getValue('status') === 'failed' ? 'destructive' : 'outline'} className={row.getValue('status') === 'verified' ? "text-white bg-green-500" : row.getValue('status') === 'failed' ? 'text-white' : "text-muted-foreground"}>{row.getValue("status")}</Badge></div>
            ),
        },
    ]

    const generateRecordsTable = () => {
        if (!domainDetails) {
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                </div>
            );
        }
        return (
            <div className="w-full flex flex-col gap-5">
                <div className="w-full flex flex-col gap-2">
                    <h1>DKIM</h1>
                    <DataTable
                        columns={columns}
                        data={getGroupedRecords(domainDetails.domain.records).DKIM}
                    ></DataTable>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <h1>SPF</h1>
                    <DataTable
                        columns={columns}
                        data={getGroupedRecords(domainDetails.domain.records).SPF}
                    ></DataTable>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <h1>DMARC</h1>
                    <DataTable columns={columns} data={getGroupedRecords(domainDetails.domain.records).DMARC} />
                </div>
            </div>
        );
    }

    const [isVerifyButtonLoading, setIsVerifyButtonLoading] = useState(false);
    const handleVerifyDomain = async (currentStatus: string) => {
        try {
            setIsVerifyButtonLoading(true);
            console.log('Requested domain verification');
            if (!domainDetails || ['verified', 'verifying'].includes(currentStatus)) return;
            const { data: response } = await mAxios.post(`/mailer/onboard/apps/:appId/domain-claims/${domainDetails.id}/verify`);
            const domainData = response.data;
            setDomainDetails(domainData);
            console.log('domainData', domainData);
            return domainData;
        }
        catch (error) {
            console.error("Error verifying domain", error);
            return null;
        }
        finally {
            setIsVerifyButtonLoading(false);
        }
    }

    const updateDomainConfig = async ({
        clickTracking,
        openTracking,
        tls
    }: {
        clickTracking?: boolean;
        openTracking?: boolean;
        tls?: boolean;
    }) => {
        let toRevertValues: Record<string, any> = {};

        let toUpdateData: Record<string, any> = {};
        if (clickTracking) {
            toRevertValues.isClickTrackingEnabled = !clickTracking;
            toUpdateData.clickTrackingEnabled = true;
        }
        if (openTracking) {
            toRevertValues.isOpenTrackingEnabled = !openTracking;
            toUpdateData.openTrackingEnabled = true;
        }
        if (tls) {
            toUpdateData.isTlsRequired = true;
        }
        console.log('toRevertValues 1', toRevertValues)
        try {
            if (!domainDetails) throw new Error("Domain details not found");
            await mAxios.put(`/mailer/onboard/apps/:appId/domain-claims/${domainDetails.id}/config-set`, toUpdateData);
            if (toUpdateData.clickTrackingEnabled) {
                setIsClickTrackingEnabled(true);
            }
            if (toUpdateData.openTrackingEnabled) {
                setIsOpenTrackingEnabled(true);
            }
            toast({
                title: "Domain configuration updated",
            });
            return true;
        }
        catch (error) {
            console.log('toRevertValues', toRevertValues);
            for (const key in toRevertValues) {
                if (key === 'isClickTrackingEnabled') {
                    setIsClickTrackingEnabled(toRevertValues[key]);
                }
                if (key === 'isOpenTrackingEnabled') {
                    setIsOpenTrackingEnabled(toRevertValues[key]);
                }
            }
            toast({
                title: "Error updating domain configuration",
            });
            return false;
        }
    }

    useEffect(() => {
        if (!domainDetails) return;
        updateDomainConfig({
            clickTracking: isClickTrackingEnabled,
        });
    }, [isClickTrackingEnabled]);
    useEffect(() => {
        if (!domainDetails) return;
        updateDomainConfig({
            openTracking: isOpenTrackingEnabled,
        });
    }, [isOpenTrackingEnabled]);

    const fetchDomainDetails = async (domainId: string) => {
        try {
            console.log('Fetching domain details')
            const { data: domain } = await mAxios.get(`/mailer/onboard/apps/:appId/domains/${domainId}`);
            console.log('domain', domain.data);
            setDomainDetails(domain.data);
        }
        catch (error) {
            console.error("Error fetching domain details");
            router.back();
            return {};
        }
    }
    let interval: NodeJS.Timeout | undefined;
    useEffect(() => {
        if (!interval) interval = setInterval(() => { console.log('Polling'); fetchDomainDetails(domainId) }, 10000);
        return () => clearInterval(interval);
    }, [domainDetails]);


    useEffect(() => {
        fetchDomainDetails(domainId);
    }, []);

    if (!domainDetails) return (
        <div className="min-h-full min-w-full flex items-center justify-center">
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                </div>
    );
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex gap-5 w-full justify-between">
                <div className="flex flex-col gap-5">
                    <h1 className={`text-3xl font-bold bg-gradient-to-r ${domainDetails?.status === 'verifying' ? 'animate-pulse' : ''} ${domainDetails?.status === 'verified' ? 'from-green-500 to-sky-500' : domainDetails?.status === 'failed' ? 'from-red-500 to-destructive-background' : 'from-primary to-yellow-400'} bg-clip-text text-transparent transition-all`}>{domainDetails?.domainName}</h1>
                    <div className="flex gap-10">
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground">Created at</p>
                            <p className="flex gap-2"><Clock className="w-4" />{domainDetails ? moment.tz(domainDetails.createdAt, moment.tz.guess()).format("YYYY-MM-DD HH:mm:ss") : ''}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground">Status</p>
                            <Badge variant={domainDetails?.status === 'verified' ? 'default' : domainDetails?.status === 'failed' ? 'destructive' : 'outline'} className={domainDetails?.status === 'verified' ? 'bg-green-500 text-white' : domainDetails?.status === 'verified' ? 'text-white' : ''}>{domainDetails?.status}</Badge>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground">Region</p>
                            <div className="flex gap-2 items-center">
                                {helpers.getFlagIcon(domainDetails?.region?.countryCode)}<p>{`${domainDetails?.region?.name} (${domainDetails?.region?.code})`}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-5 items-center">
                    <Button
                        onClick={() => handleVerifyDomain(domainDetails?.status)}
                        variant={
                            ['pending'].includes(domainDetails?.status) ? 'default' : 'outline'} disabled={['verified', 'verifying'].includes(domainDetails?.status) || isVerifyButtonLoading}>
                        {domainDetails?.status === 'pending' ? isVerifyButtonLoading ? <div className="flex gap-2 items-center"><LoaderIcon className="w-4 h-4 animate-spin" /><p className="w-fit">Verify Domain</p></div> : 'Verify Domain' : domainDetails?.status === 'failed' ? isVerifyButtonLoading ? <div className="flex gap-2 items-center"><LoaderIcon className="w-4 h-4 animate-spin" /><p className="w-fit">Verify Domain</p></div> : 'Verify Domain' : domainDetails?.status === 'verified' ? 'Verified' : <div className="flex gap-2 items-center"><LoaderIcon className="w-4 h-4 animate-spin" /><p className="w-fit">Verifying</p></div>}</Button>
                    <Dropdown triggerElement={
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    } items={[
                        {
                            key: 'delete',
                            title: 'Delete Domain',
                            variant: 'destructive',
                            icon: <Trash2 className="mr-2 h-4 w-4" />
                        }
                    ]}
                        menuLabel="Options"
                    />
                </div>
            </div>
            {domainDetails?.status === 'verifying' ? <p className="text-muted-foreground">Hang tight! The verification might take anywhere from a few minutes to a few hours. We're on it for up to 7 hours, so if it passes, we'll drop you an email. If not, double-check those DNS records and give it another go!</p> : ''}
            <div className="flex flex-col gap-5 w-full mt-10">
                <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-lg font-medium">DNS Records</h1>
                    <p className="text-muted-foreground">{
                        domainDetails?.status === 'failed' ? `Oops! Looks like your DNS records are still on vacation. Double-check that you've added the following records into your DNS provider's DNS settings page, then give 'Retry Verification' another shot!` :
                            domainDetails?.status === 'verified' ? 'Congratulations!, your DNS records are successfully verified' :
                                domainDetails?.status === 'verifying' ? `Your DNS records are on an adventure! While they’re getting verified, make sure you've added the following records into your DNS provider's DNS settings page.` :
                                    `Just a heads up: paste the following DNS records into your provider's DNS settings page, then click 'Verify Domain' to kick off the verification process.`}</p>
                </div>
                {
                    generateRecordsTable()
                }
            </div>
            <div className="flex flex-col gap-5 w-full mt-10">
                <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-lg font-medium">Click tracking</h1>
                    <p className="text-muted-foreground">RadApp temporarily redirects each link in the email through an intermediate server to track clicks. Visitors will be immediately redirected back to the original link.</p>
                    <Switch checked={isClickTrackingEnabled} onCheckedChange={setIsClickTrackingEnabled} />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <span className="flex gap-2 items-center"><h1 className="text-lg font-medium">Open tracking</h1>
                    <Badge className="w-fit opacity-60 cursor-default" variant={'outline'}>Not recommended</Badge></span>
                    <p className="text-muted-foreground">RadApp uses a 1x1 GIF to track email opens, counting each download as an open event. This tracking may not be fully accurate, as email providers and SMTP servers handle images differently, with some blocking external image downloads entirely. As a result, tracking may be incomplete or incorrect, and we do not recommend enabling this.</p>
                    <Switch checked={isOpenTrackingEnabled} onCheckedChange={setIsOpenTrackingEnabled} />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-lg font-medium">Transport Layer Security (TLS)</h1>
                    <Select items={[
                            {
                                id: 'optional',
                                title: 'Optional'
                            },
                            {
                                id: 'required',
                                title: 'Required'
                            }
                        ]}
                        defaultValue="optional"
                        title="TLS preference"
                    />
                </div>
            </div>
        </div>
    );
}

export default DomainDetails;