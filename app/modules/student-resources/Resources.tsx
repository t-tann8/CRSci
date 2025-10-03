'use client';

// component is client beacuse of pagination
import React, { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Filters from '@/app/components/common/Filters';
import Searchbar from '@/app/components/common/Searchbar';
import Pagintaion from '@/app/components/common/Pagintaion';
import ResourceDownloadModal from './ResourceDownloadModal';
import ResourcesTable, { ResourcesInterface } from './ResourcesTable';

export const resourcesList: ResourcesInterface[] = [
    {
        id: 1,
        topic: 'Data Privacy & Protection',
        assignedResources: '5',
    },
    {
        id: 1,
        topic: 'Data Privacy & Protection',
        assignedResources: '5',
    },
    {
        id: 1,
        topic: 'Data Privacy & Protection',
        assignedResources: '5',
    },
    {
        id: 1,
        topic: 'Data Privacy & Protection',
        assignedResources: '5',
    },
    {
        id: 1,
        topic: 'Data Privacy & Protection',
        assignedResources: '5',
    },
    {
        id: 1,
        topic: 'Data Privacy & Protection',
        assignedResources: '5',
    },
    {
        id: 1,
        topic: 'Data Privacy & Protection',
        assignedResources: '5',
    },
];

type Resource = {
    id: string;
    name: string;
    type: string;
    topic: string;
    url: string;
    released: boolean;
};

type Standard = {
    id: string;
    name: string;
    resourceCount: number;
    resources: Resource[];
};

type APIData = {
    totalPages: number;
    standards: Standard[];
};

function Resources({ APIdata }: { APIdata: APIData }) {
    const router = useRouter();
    const pathname = usePathname();
    const urlSearchParams = useSearchParams();
    const page = urlSearchParams.get('page') || 1;

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(urlSearchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [urlSearchParams]
    );

    const handlePageChange = (page: number) => {
        router.push(`${pathname}?${createQueryString('page', `${page}`)}`);
    };

    return (
        <section>
            <Searchbar
                headerText="All Assignments"
                tagline="Your All Assignments Allocated to Topics"
            />
            <div className="border rounded-lg p-3 px-6">
                <Filters text="All Standard's" isHideSecondBtn isHideFirstBtn />
                <ResourcesTable standards={APIdata.standards} />
            </div>
            {APIdata?.standards.length > 10 && (
                <div className="flex justify-center items-center mt-5">
                    <Pagintaion
                        currentPage={Number(page) > 0 ? Number(page) : 1}
                        totalPages={
                            APIdata?.totalPages > 0 ? APIdata.totalPages : 1
                        }
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </section>
    );
}

export default Resources;
