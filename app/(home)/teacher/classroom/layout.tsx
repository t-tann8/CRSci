import { User } from 'lucide-react';
import { Metadata } from 'next';
import Searchbar from '@/app/components/common/Searchbar';

export const metadata: Metadata = {
    title: 'Classroom',
    description: 'Here;s Your All Assigned Classroom',
};

export default function StandardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <Searchbar
                headerText="Classroom"
                tagline="All Assigned Classrooms"
                Icon={User}
            />
            {children}
        </section>
    );
}
