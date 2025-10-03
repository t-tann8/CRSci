// components/AutoLogout.tsx

'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

function AutoLogout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const path = usePathname();

    useEffect(() => {
        if (
            !session &&
            status !== 'loading' &&
            (path.includes('admin') ||
                path.includes('school') ||
                path.includes('teacher') ||
                path.includes('student'))
        ) {
            // router.push('/signin'); // Redirect to signin page or endpoint
        }
    }, [session, router, path]);

    // Return the children inside a valid JSX element
    return <>{children}</>;
}

export default AutoLogout;
