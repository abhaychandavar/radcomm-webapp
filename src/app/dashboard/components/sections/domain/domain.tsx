import DomainDetails from "./components/domainDetails";
import DomainList from "./components/domainList";

const Domain = ({ parameters }: { parameters?: Record<string, any>}) => {
    if (parameters?.domain) {
        return <DomainDetails domainId={parameters.domain} />
    }
    
    return (
        <main className="flex flex-col w-full h-full gap-5">
            <h1 className="text-3xl">Domains</h1>
            <DomainList />
        </main>
    );
}

export default Domain;