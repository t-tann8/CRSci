'use client';

// component is client beacuse of pagination
import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Filters from '@/app/components/common/Filters';
import Pagintaion from '@/app/components/common/Pagintaion';
import CommonTable from '@/app/components/common/CommonTable';
import {
    Resource,
    convertDashesToSpaces,
    commonFilterQueries,
    commonFilterOptions,
    convertDashesToSpacesSimple,
} from '@/lib/utils';
import UploadResourceModal from '../../UploadResourceModal';

function ResourceDetails({
    params,
    APIdata,
}: {
    params: { topic: string; typeName: string };
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
    const ModifiedTopicName = convertDashesToSpaces(params.typeName); // adding space after Topic
    const [isShowUploadModal, setIsShowUploadModal] = useState(false);

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

    useEffect(() => {
        if (isShowUploadModal) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isShowUploadModal]);

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

    const handleOpenUploadModal = () => {
        setIsShowUploadModal(true);
    };

    const handleCloseUploadModal = () => {
        setIsShowUploadModal(false);
    };

    return (
        <div>
            <Filters
                text={`${APIdata.totalResources}  ${
                    params.typeName.startsWith('Total-Video')
                        ? ' Videos'
                        : `${convertDashesToSpacesSimple(params.typeName)}`
                }   in total`}
                secondButtonText={
                    params.typeName.startsWith('Total-Video')
                        ? 'Upload Videos'
                        : `Upload ${convertDashesToSpacesSimple(
                              params.typeName
                          )}`
                }
                isHideFirstBtn
                handleClick={handleOpenUploadModal}
            />

            <div className="py-2 px-4 border rounded-lg mt-4">
                <Filters
                    text={ModifiedTopicName}
                    secondButtonText="Newest First"
                    options={[...commonFilterOptions]}
                    handleFilterUpdate={handleFilterUpdate}
                    isHideSecondBtn
                />
                <CommonTable
                    resources={APIdata.resources}
                    resourcesType={params.typeName}
                    currentPage={Number(page) - 1}
                    limit={10}
                    handlePageChange={handlePageChange}
                />
            </div>

            {APIdata.resources.length > 10 && (
                <div className="flex items-center w-full justify-center mt-5">
                    <Pagintaion
                        currentPage={Number(page) > 0 ? Number(page) : 1}
                        totalPages={
                            APIdata?.totalPages > 0 ? APIdata.totalPages : 1
                        }
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {isShowUploadModal && (
                <div className="fixed right-0 top-0 z-50 w-[100%] md:w-[60%] lg:w-[30%]">
                    <UploadResourceModal onClose={handleCloseUploadModal} />
                </div>
            )}
        </div>
    );
}
export default ResourceDetails;
