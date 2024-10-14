'use client';

import mAxios from "@/app/utils/mAxios";
import Dropdown from "@/components/dropdown";
import { DataTable } from "@/components/table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { LoaderIcon, Trash2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import { Badge } from "@/components/ui/badge";
import ScheduleTask from "./components/addDomainModal";
import { useChannel } from "ably/react";
import { useRealtimeDetails } from "@/components/realtimeProvider";

type Tasks = {
    id: string,
    callbackUrl: string,
    createdAt: string,
    scheduleEpoch: number,
    scheduledAtString: string,
    name?: string
}

let taskFilter: string | undefined;

const Tasks = ({ client }: any) => {
    const [isTaskCreating, setIsTaskCreating] = useState(false);
    const [apiKeyToDelete, setApiKeyToDelete] = useState<string | null>(null);
    const [currDataLength, setCurrDataLength] = useState(-1);
    const [resetDataTable, setResetDataTable] = useState(true);
    const [tasksData, setTasksData] = useState<any[]>([]);
    const [isTaskDataLoading, setIsTaskDataLoading] = useState(false);
    const [taskSortingFields, setTaskSortingFields] = useState<Array<{field: string, sortHistory: Array<-1 | 1>}>>([
        {
            field: 'createdAt',
            sortHistory: [-1]
        }
    ]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [tasksPerPage, setTasksPerPage] = useState(50);
    const channelDetails = useRealtimeDetails();
    const handleTaskExecutionMessage = (message: any) => {
        const { id, status, retryCount } = message;
        console.log('status', status);
        switch (status) {
            case 'succeeded': {
                const filteredTasks = tasksData.filter((task) => task.id !== id);
                setTasksData(filteredTasks);
                setCurrDataLength(filteredTasks.length);
                break;
            }
            case 'failed': {
                const updatedTasks = tasksData.map((task) => {
                    if (task.id === id) {
                        return { ...task, status: 'failed', retryCount  };
                    }
                    return task;
                });
                setTasksData(updatedTasks);
                break;
            }
            default: {
                break;
            }
        }
    }
    const { channel } = useChannel(channelDetails.channelName, 'message', (messageData) => {
        const { message } = messageData.data;
        const { type } = message;
        if (type === 'TASK_EXECUTION') {
            handleTaskExecutionMessage(message);
        }
    })
    const sortTaskField = async (field: string) => {
        let sortFieldFound = false;
        const taskSortFields = taskSortingFields.map((task): {
            field: string,
            order: -1 | 1 | undefined,
            sortHistory: Array<-1 | 1>
        } => {
            if (task.field === field) {
                sortFieldFound = true;
                return {
                    ...task,
                    order: task.sortHistory.length < [1, -1].length ? task.sortHistory[task.sortHistory.length - 1] === 1 ? -1 : 1 : undefined,
                    sortHistory: task.sortHistory.length < [1, -1].length ? [...task.sortHistory, task.sortHistory[task.sortHistory.length - 1] === 1 ? -1 : 1] : []
                }
            }
            return {
                ...task,
                order: task.sortHistory.length ? task.sortHistory[task.sortHistory.length - 1] : undefined
            };
        });
        if (!sortFieldFound) {
            taskSortFields.push({
                field,
                order: -1,
                sortHistory: [-1]
            })
        }
        await getTasks(1, tasksPerPage, taskFilter, taskSortFields);
        setTaskSortingFields(taskSortFields);
    }
    const columns: ColumnDef<Tasks>[] = [
        {
            accessorKey: "id",
            header: ({ column }: { column: any }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={async () => {
                        await sortTaskField('id');
                    }}
                  >
                    ID
                    <CaretSortIcon className={`ml-2 h-4 w-4`} color={taskSortingFields.find((ele) => {
                            return (ele.field === 'id' && ele.sortHistory.length)
                        }) ? '#FFFFFF' : '#646464'}/>
                  </Button>
                )
              },
            cell: ({ row }) => (
                <div className="text-muted-foreground flex items-center">{row.getValue('id')}</div>
            ),
            id: 'id',
        },
        {
            accessorKey: "createdAt",
            header: ({ column }: { column: any }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={async () => {
                        await sortTaskField('createdAt');
                    }}
                  >
                    Created at
                    <CaretSortIcon className={`ml-2 h-4 w-4`} color={taskSortingFields.find((ele) => {
                            return (ele.field === 'createdAt' && ele.sortHistory.length)
                        }) ? '#FFFFFF' : '#646464'}/>
                  </Button>
                )
              },
            cell: ({ row }) => <div className="text-muted-foreground">{moment.tz(row.getValue('createdAt'), moment.tz.guess()).format('DD MM YYYY, h:mm:ss A')}</div>,
            id: 'createdAt',
            enableSorting: true,
        },
        {
            accessorKey: "callbackUrl",
            header: ({ column }: { column: any }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={async () => {
                        await sortTaskField('callbackUrl');
                    }}
                  >
                    URL
                    <CaretSortIcon className={`ml-2 h-4 w-4`} color={taskSortingFields.find((ele) => {
                            return (ele.field === 'callbackUrl' && ele.sortHistory.length)
                        }) ? '#FFFFFF' : '#646464'}/>
                  </Button>
                )
              },
            cell: ({ row }) => <div className="text-muted-foreground items-center justify-start flex">{row.getValue('callbackUrl')}</div>,
            id: 'callbackUrl',
            enableSorting: true
        },
        {
            accessorKey: "status",
            header: ({ column }: { column: any }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={async () => {
                        await sortTaskField('status');
                    }}
                  >
                    Status
                    <CaretSortIcon className={`ml-2 h-4 w-4`} color={taskSortingFields.find((ele) => {
                            return (ele.field === 'status' && ele.sortHistory.length)
                        }) ? '#FFFFFF' : '#646464'}/>
                  </Button>
                )
              },
            cell: ({ row }) => <div className="text-muted-foreground items-center justify-center flex"><Badge variant={row.getValue('status') === 'failed' ? 'destructive' : 'outline'} className={`${row.getValue('status') === 'failed' ? 'text-destructive-foreground' : row.getValue('status') === 'succeeded' ? 'text-success-foreground' : 'text-muted-foreground'}`}>{row.getValue('status') || 'pending'}</Badge></div>,
            id: 'status',
            enableSorting: true
        },
        {
            accessorKey: "retryCount",
            header: ({ column }: { column: any }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={async () => {
                        await sortTaskField('retryCount');
                    }}
                  >
                    Retry count
                    <CaretSortIcon className={`ml-2 h-4 w-4`} color={taskSortingFields.find((ele) => {
                            return (ele.field === 'retryCount' && ele.sortHistory.length)
                        }) ? '#FFFFFF' : '#646464'}/>
                  </Button>
                )
              },
            cell: ({ row }) => <div className="text-muted-foreground items-center justify-center flex">{row.getValue('retryCount')}</div>,
            id: 'retryCount',
            enableSorting: true
        },
        {
            accessorKey: "scheduledAtString",
            header: ({ column }: { column: any }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={async () => {
                        await sortTaskField('scheduleEpoch');
                    }}
                  >
                    Scheduled at
                    <CaretSortIcon className={`ml-2 h-4 w-4`} color={taskSortingFields.find((ele) => {
                            return (ele.field === 'scheduleEpoch' && ele.sortHistory.length)
                        }) ? '#FFFFFF' : '#646464'}/>
                  </Button>
                )
              },
            cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('scheduledAtString')}</div>,
            id: 'scheduledAtString'
        },
        {
            accessorKey: "name",
            header: ({ column }: { column: any }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={async () => {
                        await sortTaskField('name');
                    }}
                  >
                    Name
                    <CaretSortIcon className={`ml-2 h-4 w-4`} color={taskSortingFields.find((ele) => {
                            return (ele.field === 'name' && ele.sortHistory.length)
                        }) ? '#FFFFFF' : '#646464'}/>
                  </Button>
                )
              },
            cell: ({ row }) => <div className="text-muted-foreground items-center justify-center flex">{row.getValue('name')}</div>,
            id: 'name',
            enableSorting: true
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
                    menuLabel="Options" />
            ),
        },
    ]

    const [currentPage, setCurrentPage] = useState(-1);
    const getTasks = async (page: number, pageSize: number, searchTerm?: string, taskSortFields?: Array<{ field: string, order?: -1 | 1 }>) => {
        console.log('page', page, 'pageSize', pageSize, 'searchTerm', searchTerm, 'taskSortFields', taskSortFields);
        try {
            if (tasksData.length <= 0) setIsTaskDataLoading(true);
            const { data: fetchedTasksData } = await mAxios.get(`/tasks?${searchTerm ? `filter=${searchTerm}` : ''}&page=${page || 1}&perPage=${pageSize || 50}&sort=${taskSortFields?.map((field) => field.order ? `${field.field}:${field.order}` : '').filter((ele) => ele ? true : false).join(',')}`);
            console.log('apiKeyData.data.records', fetchedTasksData.data);
            const tasks = fetchedTasksData.data.records.map((t: Record<string, any>) => ({
                id: t.id,
                retryCount: t.retryCount,
                callbackUrl: t.callbackUrl,
                createdAt: t.createdAt,
                scheduleEpoch: t.scheduleEpoch,
                scheduledAtString: t.scheduledAtString,
                name: t.name || 'NA'
            }));
            if (page > currentPage) {
                setCurrentPage(page + 1);
                setCurrDataLength(currDataLength < 0 ? tasks.length : currDataLength + tasks.length);
            }
            setTasksData(tasks);
            setIsTaskDataLoading(false);
            setTotalTasks(fetchedTasksData.data.totalRecords);
            return tasks;
        }
        catch (error) {
            setIsTaskDataLoading(false);
            console.error('get api keys error', error);
            setTasksData([]);
            return [];
        }
    }

    useEffect(() => {
        getTasks(1, tasksPerPage);
    }, [])

    useEffect(() => {
        if (resetDataTable) setResetDataTable(false);
    }, [resetDataTable])


    const createTask = async () => {
        try {
            setIsTaskCreating(true);
            const { data } = await mAxios.post('/tasks');
            console.log('apiKeyData.data', data);
            setCurrDataLength(currDataLength < 0 ? 1 : currDataLength + 1);
        }
        catch (error) {
            console.error('create api key error', error);
        }
        finally {
            setIsTaskCreating(false);
        }
    }
    return (
        <main className="w-full h-full flex flex-col gap-5">
            <h1 className="text-3xl">Tasks</h1>
            <div className="flex flex-col gap-2">
                <ScheduleTask onTaskCreated={
                    () => { getTasks(1, tasksPerPage); }
                } />
            </div>
            <DataTable searchBar={{
                placeholder: 'Search by task Name / URL / ID',
            }}
                searchHandler={(value) => {
                    taskFilter = value;
                    getTasks(1, tasksPerPage, value);
                }}
                pagination={
                    true
                }
                columns={columns}
                data={tasksData}
                isLoading={isTaskDataLoading}
                pageSize={tasksPerPage}
                handlePageChange={async (page) => {
                    await getTasks(page, tasksPerPage, taskFilter, taskSortingFields);
                }}
                totalDataLength={totalTasks}
            />
        </main>
    )
}

export default Tasks;