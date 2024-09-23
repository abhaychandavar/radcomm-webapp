'use client';

import Nav from "@/components/nav";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ArrowUpDown, Globe2, HandCoins, Lock, Mail, MessageCircleIcon, Puzzle, Siren, Sparkles, Speaker, Users } from "lucide-react";
import appConfig from '../../../config/config';
import Section from "./section";
import { useParams } from "next/navigation";

const DashboardLayout = ({ section }: { section: string }) => {
    const params = useParams();
    const appId = params.appId as string;

    const originPath = `${appConfig.url}/dashboard/${appId}`;
    return (
        <div className='w-full flex-1 overflow-y-hidden'>
            <ResizablePanelGroup
                direction="horizontal"
                className="rounded-lg min-h-full ">
                <ResizablePanel defaultSize={10}>
                <Nav
                isCollapsed={false}
                links={[
                  {
                    title: "API Keys",
                    icon: Lock,
                    variant: "ghost",
                    path: `${originPath}/api-keys`
                  },
                  {
                    title: "Domains",
                    icon: Globe2,
                    variant: "default",
                    path: `${originPath}/domains`
                  },
                  // {
                  //   title: "Gen pages",
                  //   icon: Sparkles,
                  //   variant: "default",
                  //   path: `${originPath}/gen-pages`
                  // },
                  {
                    title: "Emails",
                    icon: Mail,
                    variant: "ghost",
                    path: `${originPath}/emails`
                  },
                  // {
                  //   title: "SMS",
                  //   icon: MessageCircleIcon,
                  //   variant: "ghost",
                  //   path: `${originPath}/sms`
                  // },
                  // {
                  //   title: "Push notifications",
                  //   icon: Siren,
                  //   variant: "ghost",
                  //   path: `${originPath}/push`
                  // },
                  // {
                  //   title: "Custom messages",
                  //   icon: Puzzle,
                  //   variant: "ghost",
                  //   path: `${originPath}/custom-messages`
                  // },
                  // {
                  //   title: "Clubbed Campaigns",
                  //   icon: Speaker,
                  //   variant: "ghost",
                  //   path: `${originPath}/clubbed-campaigns`
                  // },
                  // {
                  //   title: "Audience",
                  //   icon: Users,
                  //   variant: "ghost",
                  //   path: `${originPath}/audience`
                  // },
                  {
                    title: "Webhooks",
                    icon: ArrowUpDown,
                    variant: "ghost",
                    path: `${originPath}/webhooks`
                  },
                  {
                    title: "Billing",
                    icon: HandCoins,
                    variant: "ghost",
                    path: `${originPath}/billing`
                  }
                ].map((sec) => sec.path === `${originPath}/${section}` ? { ...sec, variant: 'default' } : { ...sec, variant: 'ghost'})}
              />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50} maxSize={200} className="!overflow-y-auto min-h-full">
                    <Section sectionName={section} parameters={params} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}


export default DashboardLayout;