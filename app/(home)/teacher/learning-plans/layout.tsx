'use client';

import { useRouter } from 'next/navigation';
import StandardIcon from '@/app/assets/icons/StandardIcon';
import Searchbar from '@/app/components/common/Searchbar';

export default function StandardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { back } = useRouter();
    return (
        <section>
            <Searchbar
                headerText="Learning Plan"
                tagline="All Created Plans"
                Icon={StandardIcon}
                isShowBackArrow
                onBackClick={back}
            />
            {children}
        </section>
    );
}
