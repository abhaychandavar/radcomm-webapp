import { Separator } from "@/components/ui/separator";
import TopBarHandler from "./components/topBar";
import { ReactNode } from "react";

const App = ({ children }: { children: ReactNode }) => {
    return (
        <main className="h-screen w-screen bg-background flex justify-center items-center">
        <main className="h-screen w-screen flex items-center flex-col">
        <TopBarHandler />
        <Separator />
        {children}
        </main>
    </main>

    )
}

export default App;