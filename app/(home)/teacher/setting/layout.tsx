import { Settings } from 'lucide-react';
import { Metadata } from 'next';
import Searchbar from '@/app/components/common/Searchbar';

export const metadata: Metadata = {
    title: 'Settings',
    description: 'Manage Your Profile',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <Searchbar
                headerText="Settings"
                Icon={Settings}
                tagline="Manage Your Profile"
            />
            {children}
        </section>
    );
}
