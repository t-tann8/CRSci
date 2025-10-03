'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AssignmentIcon from '@/app/assets/icons/AssignmentIcon';
import DocxIcon from '@/app/assets/icons/DocxIcon';
import UploadResourceModal from '@/app/components/common/UploadResourceModal';
import Searchbar from '@/app/components/common/Searchbar';
import AssignmentCard, { AssignmentInterface } from './AssignmentCard';

const uploadedAssignment: AssignmentInterface[] = [
    {
        id: '1',
        fileName: 'Test file',
    },
    {
        id: '1',
        fileName: 'Test file',
    },
];

const referenceMaterial: AssignmentInterface[] = [
    {
        id: '1',
        fileName: 'Test file',
    },
    {
        id: '1',
        fileName: 'Test file',
    },
];

function SubmitAssignment() {
    const { push, back } = useRouter();
    const pathname = usePathname();
    const [isShowUploadModal, setIsShowUploadModal] = useState(false);

    return (
        <section>
            <Searchbar
                headerText="My Learnings"
                tagline="Here’s Your All Learning Assigned to You"
                isShowBackArrow
                onBackClick={back}
            />
            <div className="flex justify-between flex-col lg:flex-row mt-8">
                <div className="flex space-x-2">
                    <AssignmentIcon />
                    <p className="text-xl font-semibold">Assignment - XYZ</p>
                </div>
                <div className="flex lg:space-x-2 flex-col lg:flex-row mobile:space-y-4 mobile:my-4 lg:my-0">
                    <button
                        type="button"
                        className="py-3 px-4 border h-fit border-primary-color text-dark-gray rounded-xl font-semibold cursor-pointer hover:bg-primary-color hover:text-white"
                        onClick={() => setIsShowUploadModal(true)}
                    >
                        Upload File
                    </button>
                    <button
                        type="button"
                        className="py-3 px-4 bg-primary-color text-white rounded-xl font-semibold cursor-pointer"
                        onClick={() =>
                            push('/student/learning/create-assignment')
                        }
                    >
                        Create Assignment
                    </button>
                </div>
            </div>
            <p className="text-dark-gray text-xl font-semibold mt-3">
                Uploaded Assignments
            </p>

            {uploadedAssignment.map((assignment: AssignmentInterface) => (
                <AssignmentCard card={assignment} key={assignment.id} />
            ))}

            <p className="text-dark-gray text-xl font-semibold mt-8">
                Reference Material
            </p>
            {referenceMaterial.map((assignment: AssignmentInterface) => (
                <AssignmentCard
                    card={assignment}
                    key={assignment.id}
                    isReferenceMaterial
                />
            ))}

            {isShowUploadModal && (
                <div className="fixed right-0 top-0 z-50 w-[100%] md:w-[60%] lg:w-[25%]">
                    <UploadResourceModal
                        headerText="Upload Assignment"
                        buttonText="Submit Assignment"
                        Icon={DocxIcon}
                        description="Upload Your Assignment"
                        onClose={() => setIsShowUploadModal(false)}
                    />
                </div>
            )}
        </section>
    );
}

export default SubmitAssignment;
