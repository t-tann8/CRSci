import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Learning',
    description: 'Here’s Your All Learning Assigned to You',
};

function layout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <div className="md:basis-full ">{children}</div>
        </section>
    );
}

export default layout;
