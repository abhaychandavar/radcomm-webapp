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
import { LoaderIcon, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        {
            message: "Please provide a valid email address",
        }
    )
});

const WaitListModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });


    const onSubmit = async () => {
        try {
            setIsLoading(true);
            const { data: response } = await mAxios.post('/users/waitlist', {
                 email: form.getValues().email
             });
             toast({
                title: 'Added you to waitlist',
                duration: 2000
            });
             return response.data;
         }
         catch (error: any) {
             console.error('Could not add you to waitlist', error);
             if (error?.response?.data?.code === 'radapp/app/auth/already-in-waitlist') {
                 toast({
                     title: 'Already in waitlist',
                     duration: 2000
                 });
                 return null;
             }
             toast({
                 title: 'Could not add you to waitlist',
                 duration: 1000
             });
             return null;
         }
         finally {
            setIsLoading(false);
            setIsModalOpen(false);
         }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button variant='default' className="w-fit flex items-center justify-center"><Mail className="w-4 h-4 mr-2" />Join waitlist</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Join Waitlist</DialogTitle>
                    <DialogDescription>
                        We will need your email address to reach out to you when we go live!
                    </DialogDescription>
                </DialogHeader>
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email address</FormLabel>
                                        <FormControl><Input id="email" placeholder="your-name.example.com" className="col-span-3" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose>
                                <Button variant={'ghost'} type="reset" >Cancel</Button>
                            </DialogClose>
                            <Button variant={isLoading ? 'outline' : 'default'} disabled={isLoading} type="submit" className="flex items-center justify-center">{isLoading ? <><LoaderIcon className="w-4 h-4 animate-spin mr-2" /> Joining</> : 'Join now'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default WaitListModal;