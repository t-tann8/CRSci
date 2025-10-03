'use client';

// component is client beacuse of pagination
import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Filters from '@/app/components/common/Filters';
import ResourceIcon from '@/app/assets/icons/ResourceIcon';
import Searchbar from '@/app/components/common/Searchbar';
import Pagintaion from '@/app/components/common/Pagintaion';
import {
    Resource,
    commonFilterQueries,
    commonFilterOptions,
} from '@/lib/utils';
import ResourcesTable from './ResourcesTable';
import UploadResourceModal from './UploadResourceModal';

function Resoures({
    APIdata,
}: {
    APIdata: {
        resources: Resource[];
        totalResources: number;
        totalPages: number;
    };
}) {
    const router = useRouter();
    const pathname = usePathname();
    const urlSearchParams = useSearchParams();
    const page = urlSearchParams.get('page') || 1;
    const [showAddResourceModal, setShowResourceModal] = useState(false);

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

    const handleFilterUpdate = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const query =
            commonFilterQueries[
                event.target.value as keyof typeof commonFilterQueries
            ];
        if (query) {
            router.push(
                `?page=${page}&orderBy=${query.orderBy}&sortBy=${query.sortBy}`
            );
        } else {
            router.push(`?page=${page}`);
        }
    };

    useEffect(() => {
        if (showAddResourceModal) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [showAddResourceModal]);

    return (
        <section>
            <Searchbar
                headerText="All Resources"
                Icon={ResourceIcon}
                iconColor="#F59A3B"
                tagline="Your All Resources Are Listed Here"
            />
            <div className="rounded-lg border mt-5 py-3 md:px-6 mobile:px-3">
                <Filters
                    text="Resources"
                    textColor="text-black"
                    secondButtonText="Upload Resources"
                    options={[...commonFilterOptions]}
                    handleFilterUpdate={handleFilterUpdate}
                    handleClick={() => setShowResourceModal(true)}
                />
                <ResourcesTable
                    resources={APIdata.resources}
                    currentPage={Number(page) - 1}
                    limit={10}
                    handlePageChange={handlePageChange}
                />
            </div>
            <div className="flex items-center w-full justify-center mt-5">
                <Pagintaion
                    currentPage={Number(page) > 0 ? Number(page) : 1}
                    totalPages={
                        APIdata?.totalPages > 0 ? APIdata.totalPages : 1
                    }
                    onPageChange={handlePageChange}
                />
            </div>
            {showAddResourceModal && (
                <div className="fixed right-0 top-0 z-50 w-[100%] md:w-[60%] lg:w-[30%]">
                    <UploadResourceModal
                        onClose={() => setShowResourceModal(false)}
                    />
                </div>
            )}
        </section>
    );
}

export default Resoures;
