import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'Track Of Performance & Progress',
};

function layout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <div className="lg:basis-full ">{children}</div>
        </section>
    );
}

export default layout;
