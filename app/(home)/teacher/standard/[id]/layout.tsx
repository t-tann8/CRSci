'use client';

import { useRouter } from 'next/navigation';
import Searchbar from '@/app/components/common/Searchbar';
import TeacherStandardIcon from '@/app/assets/icons/TeacherStandardIcon';

export default function StandardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { back } = useRouter();
    return (
        <section>
            <Searchbar
                headerText="Learning Standards"
                tagline="Here’s All Your Learning Standards"
                Icon={TeacherStandardIcon}
                isShowBackArrow
                onBackClick={back}
            />
            {children}
        </section>
    );
}
