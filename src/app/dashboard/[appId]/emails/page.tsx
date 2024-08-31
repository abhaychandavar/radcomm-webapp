
// app/dashboard/page.tsx
import { useParams } from 'next/navigation';
import DashboardLayout from '../../components/dashboardLayout';
import { Separator } from '@/components/ui/separator';
import TopBar from '../components/topBar';

const Section = () => {
    
    return (
        <DashboardLayout section='emails' />
    );
};

export default Section;
