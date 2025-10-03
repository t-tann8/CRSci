import React from 'react';
import { Metadata } from 'next';
import Searchbar from '@/app/components/common/Searchbar';

export const metadata: Metadata = {
    title: 'Data Aggregation',
    description: 'Class Performance on the Basis of Standards',
};

function layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="px-2 lg:px-4">
            <Searchbar
                headerText="Data Aggregation"
                tagline="Class Performance of each Teacher"
            />
            <div className="md:basis-full ">{children}</div>
        </section>
    );
}

export default layout;
