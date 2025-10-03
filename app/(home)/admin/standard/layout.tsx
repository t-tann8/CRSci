import { Metadata } from 'next';
import StandardIcon from '@/app/assets/icons/StandardIcon';
import Searchbar from '@/app/components/common/Searchbar';

export const metadata: Metadata = {
    title: 'Standards',
    description: 'All standards are here',
};

export default function StandardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <Searchbar
                headerText="Standards"
                tagline="All Standards Are Listed Here"
                Icon={StandardIcon}
            />
            {children}
        </section>
    );
}
