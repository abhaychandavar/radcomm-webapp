'use client';

import mAxios from "@/app/utils/mAxios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { useState } from "react";

const DeleteApiKeyModal = ({ apiKey, isOpen = false, onClose }: { apiKey: string, isOpen: boolean, onClose: (isSuccess?: boolean) => void }) => {
    const [isApiKeyDeleting, setIsApiKeyDeleting] = useState(false);
    const [confirmationStr, setConfirmationStr] = useState('');
    const { toast } = useToast();

    const handleApiKeyDelete = async () => {
        try {
            setIsApiKeyDeleting(true);
            if (confirmationStr !== 'I\'m sure') {
                throw { messageStr: 'Confirmation string does not match' };
            }
            await mAxios.delete(`/apps/api/keys/${apiKey}`);
            toast({
                title: 'API key deleted',
                duration: 5000
            });
            onClose(true);
        }
        catch (error: any) {
            console.error('Error deleting API key', error);
            toast({
                title: error.messageStr || 'Something went wrong',
                duration: 5000,
                variant: 'destructive',
            });
        }
        finally {
            setIsApiKeyDeleting(false);
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete API Key</DialogTitle>
                    <DialogDescription>
                        <div><p className="break-words">Are you sure you want to delete this Api key? Any resources using this API key will no longer work.</p></div>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <p>Type "I'm sure" to confirm</p>
                    <Input className="w-full" onChange={(e) => setConfirmationStr(e.target.value)}/>
                </div>
                <DialogFooter>
                    <Button variant={'destructive'} onClick={handleApiKeyDelete} disabled={isApiKeyDeleting}>{isApiKeyDeleting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <></>}Delete API Key</Button>
                    <DialogClose><Button variant={'outline'}>Cancel</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteApiKeyModal;