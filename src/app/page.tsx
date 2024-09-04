import { Button } from "@/components/ui/button";
import config from "@/config/config";
import { Mail, Video } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="p-5 bg-black md:flex md:h-screen md:w-screen md:items-center md:justify-center">
      <div className="hidden md:block absolute top-0 left-0 w-[200px] h-[200px] bg-primary blur-[200px] rounded-lg"></div>

      <div className="flex flex-col-reverse gap-5 md:flex-row md:items-center md:w-[80%]">
        <div className="flex flex-col gap-5 items-center md:items-start p-5">
          <h1 className="text-[4rem] md:text-[5rem] mr-0 p-0 text-center md:text-left bg-clip-text bg-gradient-to-r from-primary to-[#a04e00] text-transparent">
            <strong>R</strong>ad<strong>A</strong>pp
          </h1>

          <div className="w-full">
            <p className="text-base text-muted-foreground mb-2 text-center md:text-left">
              Effortlessly build real-time apps, send emails that reach the inbox, and schedule tasks—all in one platform.
            </p>
            <p className="text-base font-semibold text-muted-foreground text-center md:text-left">
              Focus on what matters most, and let us handle the rest!
            </p>
          </div>
          <Button className="w-fit"><Mail className="w-4 h-4 mr-2" />Join waitlist</Button>
        </div>
        <video width="w-1" controls={false} preload="true" autoPlay={true} muted loop className="md:w-1/2">
          <source src={config.hero.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </main>
  );
}
