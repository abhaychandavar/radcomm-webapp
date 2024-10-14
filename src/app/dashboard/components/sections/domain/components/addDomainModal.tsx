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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    domain: z.string().regex(
        /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/,
        {
            message: "Please provide a valid domain name",
        }
    ),
    region: z.string(
        {
            required_error: "Please select a region",
        }
    ).min(1)
});

const AddDomainModal = ({ buttonVariant = 'default' }: { buttonVariant?: "destructive" | "outline" | "secondary" | "ghost" | 'default' | null }) => {
    const router = useRouter();
    const { toast } = useToast();
    const path = usePathname();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            domain: "",
        },
    });

    const [regions, setRegions] = useState<Array<{
        title: string,
        id: string,
        icon: string
    }>>([]);

    const onSubmit = async () => {
        try {
            const { data: response } = await mAxios.post('/mailer/onboard/domain', {
                 domain: form.getValues().domain,
                 region: form.getValues().region
             });
             router.push(`${path}/${response.data.id}`);
         }
         catch (error) {
             console.error('Add domain error', error);
             toast({
                 title: 'Could not create app, please try again',
                 duration: 5000
             });
         }
    }

    useEffect(() => {
        const fetchRegions = async () => {
            const { data: response } = await mAxios.get('/apps/regions');
            const { data } = response;
            setRegions(data);
        }
        fetchRegions();
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={buttonVariant} className="w-fit">Add domain</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add domain</DialogTitle>
                    <DialogDescription>
                        Add your domain here and select a region closest to your audience to start sending emails
                    </DialogDescription>
                </DialogHeader>
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="domain"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Domain</FormLabel>
                                        <FormControl><Input id="name" placeholder="example.your-host.com" className="col-span-3" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="region"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Region</FormLabel>
                                        <Select items={regions.map((regionData) => ({
                                            id: regionData.id,
                                            icon: regionData.icon,
                                            title: regionData.title,
                                        }))} 
                                        title="Region" 
                                        spread 
                                        placeholder="Select closest region" 
                                        defaultValue={field.value} 
                                        isFormItem={true}
                                        onSelect={field.onChange}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant={'default'} type="submit">Add</Button>
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

export default AddDomainModal;