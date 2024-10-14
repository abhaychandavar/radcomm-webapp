'use client';

import mAxios from "@/app/utils/mAxios";
import Select from "@/components/select"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import moment from "moment-timezone";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    callbackUrl: z.string().regex(
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        {
            message: "Please provide a valid callback URL",
        }
    ),
    payload: z.string().optional(),
    headers: z.string().optional(),
    persistData: z.boolean().optional(),
    scheduleAt: z.string().optional(),
    name: z.string().optional()
});

const ScheduleTask = ({ buttonVariant = 'default', onTaskCreated }: { buttonVariant?: "destructive" | "outline" | "secondary" | "ghost" | 'default' | null, onTaskCreated?: () => void }) => {
    const router = useRouter();
    const { toast } = useToast();
    const path = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            callbackUrl: "",
            payload: undefined,
            headers: undefined,
            persistData: false,
            scheduleAt: Date.now().toString(),
            name: undefined
        },
    });

    const [regions, setRegions] = useState<Array<{
        title: string,
        id: string,
        icon: string
    }>>([]);

    const onSubmit = async () => {
        try {
            const { data: response } = await mAxios.post('/tasks/', {
                callbackUrl: form.getValues().callbackUrl,
                payload: form.getValues().payload,
                headers: form.getValues().headers,
                persist: form.getValues().persistData,
                scheduleTimeEpoch: moment(form.getValues().scheduleAt).unix(),
                name: form.getValues().name
             });
             setIsOpen(false);
             onTaskCreated && onTaskCreated();
             toast({
                title: 'Task scheduled',
                duration: 5000
            });
         }
         catch (error) {
             console.error('Add domain error', error);
             toast({
                 title: 'Could not schedule task, please try again',
                 duration: 5000
             });
         }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild>
                <Button variant={buttonVariant} className="w-fit">Schedule task</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Schedule task</DialogTitle>
                    <DialogDescription>
                        While execution radapp makes a POST request to the following callback URL with the provided payload and headers
                    </DialogDescription>
                </DialogHeader>
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="callbackUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Callback URL</FormLabel>
                                        <FormControl><Input id="callbackUrl" placeholder="https://example.com/your-path" className="col-span-3" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Task name <span className="text-muted-foreground">(Optional)</span></FormLabel>
                                        <FormControl><Input id="name" placeholder="My task" className="col-span-3" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="payload"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payload <span className="text-muted-foreground">(Optional, Stringified JSON)</span></FormLabel>
                                        <FormControl><Input id="callbackUrl" placeholder="{ yourKey: yourValue }" className="col-span-3" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="headers"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Headers <span className="text-muted-foreground">(Optional, Stringified JSON)</span></FormLabel>
                                        <FormControl><Input id="callbackUrl" placeholder="{ header-name: headerValue }" className="col-span-3" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="scheduleAt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Schedule at <span className="text-muted-foreground">(Radapp will persist task details)</span></FormLabel>
                                        <br/>
                                        <FormControl><Input id="scheduleAt" type="datetime-local" {...field}  /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="persistData"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Persist data <span className="text-muted-foreground">(Radapp will persist task details)</span></FormLabel>
                                        <br/>
                                        <FormControl><Switch id="persistData" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant={'default'} type="submit">Schedule</Button>
                            <DialogClose>
                                <Button variant={'ghost'} type="reset" >Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ScheduleTask;