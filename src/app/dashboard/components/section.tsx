import Domain from "./sections/domain/domain";

const getSection = (sectionName: string, parameters?: Record<string, any>): JSX.Element => {
    switch (sectionName) {
        case 'domains': {
            return <Domain parameters={parameters} />
        }
        default: {
            return <></>
        }
    }
}
const Section = ({ sectionName, parameters }: { sectionName: string, parameters?: Record<string, any> }) => {
    return (
        <main className="flex flex-col gap-2 p-5">
            { getSection(sectionName, parameters) }
        </main>
    );
}

export default Section;