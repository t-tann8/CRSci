'use client';

import { usePathname, useRouter } from 'next/navigation';
import Searchbar from '@/app/components/common/Searchbar';
import ResourceIcon from '@/app/assets/icons/ResourceIcon';
import { convertDashesToSpaces } from '@/lib/utils';

export default function TopicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Extracting and formatting a title from the pathname
    const title = usePathname().split('/')[3]; // Get the fourth segment of the pathname
    const formattedTitle = convertDashesToSpaces(title); // Convert dashes to spaces
    const { back } = useRouter();
    return (
        <section>
            <Searchbar
                headerText={formattedTitle}
                Icon={ResourceIcon}
                tagline="All Resources Assigned To "
                extendedTagline={formattedTitle}
                isShowBackArrow
                onBackClick={back}
                iconColor="#F59A3B"
            />
            {children}
        </section>
    );
}
