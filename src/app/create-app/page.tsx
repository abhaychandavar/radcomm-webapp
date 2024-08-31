'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import mAxios from "../utils/mAxios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    appName: z.string().min(2, {
      message: "App name must be at least 2 characters.",
    }),
  })

const CreateApp = () => {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          appName: "",
        },
      });
      const onSubmit = async () => {
        try {
           await mAxios.post('/apps/', {
                name: form.getValues().appName
            });
            router.push('/dashboard');
        }
        catch (error) {
            console.error(error);
            toast({
                title: 'Could not create app, please try again',
                duration: 5000
            });
        }
      };
    return (
        <main className="h-screen w-screen bg-background flex justify-center items-center">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <FormField
                        control={form.control}
                        name="appName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>App name</FormLabel>
                                <FormControl>
                                    <Input placeholder="My app" maxLength={60} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Create app</Button>
                    </form>
                </Form>
        </main>
    );
}


export default CreateApp;