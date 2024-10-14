import RealtimeProvider from "@/components/realtimeProvider";
import ApiKeys from "./sections/api-keys/apiKeys";
import Domain from "./sections/domain/domain";
import Tasks from "./sections/tasks/tasks";
import { useAuthDetails } from "@/components/authProvider";

const getSection = (sectionName: string, parameters?: Record<string, any>, auth?: Record<string, any> | null): JSX.Element => {
    console.log('provided auth', auth)
    switch (sectionName) {
        case 'domains': {
            return <></>; //<Domain parameters={parameters} />
        }
        case 'api-keys': {
            return <ApiKeys parameters={parameters} />
        }
        case 'tasks': {
            return <RealtimeProvider><Tasks parameters={parameters} /></RealtimeProvider>
        }
        default: {
            return <></>
        }
    }
}
const Section = ({ sectionName, parameters }: { sectionName: string, parameters?: Record<string, any> }) => {
    const authDetails = useAuthDetails();
    return (
        <main className="flex flex-col gap-2 p-20">
            { getSection(sectionName, parameters, authDetails.auth) }
        </main>
    );
}

export default Section;