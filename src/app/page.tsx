import WaitListModal from "@/components/waitListModal";
import config from "@/config/config";

export default function Home() {
  return (
    <main className="p-5 bg-black md:flex md:h-screen md:w-screen md:items-center md:justify-center">
      <div className="hidden md:block absolute top-0 left-0 w-[200px] h-[200px] bg-primary blur-[200px] rounded-lg"></div>

      <div className="flex flex-col-reverse gap-0 md:gap-5 md:flex-row md:items-center md:w-[80%]">
        <div className="flex flex-col gap-5 items-center md:items-start p-5 animate-fadeInSlideUp">
          <h1 className="text-3xl md:text-7xl mr-0 p-0 text-center md:text-left bg-clip-text bg-gradient-to-r from-primary to-[#a04e00] text-transparent">
            One platform <br /> for all things DEV
          </h1>

          <div className="w-full">
            <p className="text-base text-muted-foreground mb-2 text-center md:text-left">
              Effortlessly build real-time apps, send emails that reach the inbox, and schedule tasks—all in one platform.
            </p>
          </div>
          <WaitListModal />
        </div>
        <video width="w-1"
          height="h-1" className="md:w-1/2 animate-fadeInSlideUp"
          loop={true} muted={true}
          autoPlay={true}
          controls={false}
          poster="https://vmpn09wz4fdok1nr.public.blob.vercel-storage.com/earthTechPoster-acTGACnQl7YAGCldEYRbYLsAIsBU3t.png"
          preload="auto"
          playsInline={true}
        >
          <source src={config.hero.videoUrl} type="video/mp4" />
        </video>
      </div>
    </main>
  );
}
