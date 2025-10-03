import { UserIcon } from 'lucide-react';
import { Metadata } from 'next';
import Searchbar from '@/app/components/common/Searchbar';

export const metadata: Metadata = {
    title: 'Users',
    description: 'Manage Your All Users',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <Searchbar
                headerText="All Users"
                Icon={UserIcon}
                tagline="Manage Your All Users"
            />
            {children}
        </section>
    );
}
