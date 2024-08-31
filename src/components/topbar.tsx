"use client"

import * as React from "react"

import { LogOut } from "lucide-react";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import Select from "./select";
import axios from "axios";
import Dropdown from "./dropdown";

export function AvatarButtonComponent() {
    return (
        <Dropdown
            items={
                [
                    {
                        key: 1,
                        title: 'Logout',
                        icon: <LogOut className="mr-2 h-4 w-4" />,
                        shortcut: "������Q",
                    }
                ]
            }
            menuLabel="My Account"
            triggerElement={<Avatar className="w-8 h-8 cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
            </Avatar>} />
    );
}
const TopBar = ({ title, apps, defaultAppId }: { title: string, apps: Array<{ name: string, id: string }>, defaultAppId?: string }) => {
    return (
        <div className='w-full flex justify-between p-2 items-center'>
            <div className="flex gap-5 items-center">
                {title}
            </div>
            <div className="flex gap-5 items-center">
                <Select items={apps.length ? apps.map((app: {
                    id: string,
                    name: string,
                }) => {
                    return {
                        id: app.id,
                        title: app.name,
                    };
                }) : []}
                    title={'Apps'}
                    onSelect={async (value) => {
                        await axios.post('/api/apps', { appId: value });
                        localStorage.setItem('appId', value);
                    }}
                    defaultValue={
                        apps.length ? apps.find((app) => app.id === defaultAppId)?.id : undefined
                    }
                />
                <Dropdown
                    menuLabel="My Account"
                    items={
                        [
                            {
                                key: 1,
                                title: 'Logout',
                                icon: <LogOut className="mr-2 h-4 w-4" />,
                                shortcut: "⇧⌘Q",
                            }
                        ]
                    }

                    triggerElement={<Avatar className="w-8 h-8 cursor-pointer">
                        <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
                    </Avatar>} />
            </div>
        </div>
    );
}

export default TopBar;