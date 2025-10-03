'use client';

import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import Searchbar from '@/app/components/common/Searchbar';
import { Button } from '@/app/components/ui/button';
import TabBar from '@/app/components/common/TabBar';
import StudentsInfoTable from './StudentsInfoTable';
import AddStudentModal from './AddStudentModal';

function Students({ data }: { data: any }) {
    const gradeOptions = data?.map((grade: any) => grade?.className);
    const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(gradeOptions[0]);
    const [studentsData, setStudentsData] = useState<any[]>([]);

    useEffect(() => {
        if (data && selectedTab) {
            const filterClass = data.find(
                (grade: any) => grade?.className === selectedTab
            );
            if (filterClass) {
                const filteredStudents = filterClass?.studentsData?.map(
                    (student: any, index: number) => ({
                        id: student?.userId,
                        index: index + 1,
                        name: student?.userName,
                        email: student?.userEmail,
                        image: student?.image,
                        classroomStudentId: student?.userClassroomStudentId,
                        totalFinishedResources:
                            student?.totalFinishedResources || 0,
                        totalResourcesCount:
                            filterClass?.totalResourcesCount || 0,
                        grade: student?.className,
                        gradeId: student?.classId,
                    })
                );
                setStudentsData(filteredStudents);
            }
        }
    }, [selectedTab, data]);

    const handleOpenAddStudentModal = () => {
        setAddStudentModalOpen(true);
    };

    const handleCloseAddStudentModal = () => {
        setAddStudentModalOpen(false);
    };

    const onSelectFilter = (tab: string) => {
        setSelectedTab(tab);
    };

    return (
        <section>
            <Searchbar
                headerText="All Students"
                Icon={User}
                tagline="Here’s all Students"
            />
            <TabBar
                options={gradeOptions}
                onSelectFilter={onSelectFilter}
                initialSelectedTab={selectedTab}
            />

            <div className="flex justify-between mt-5">
                <h1 className="font-bold text-dlg">All Students</h1>

                <Button
                    className="bg-primary-color mobile:px-3 lg:hover:bg-orange-400"
                    variant="default"
                    size="default"
                    onClick={handleOpenAddStudentModal}
                >
                    Add Student
                </Button>
            </div>
            {/* <div className="rounded-lg border mt-5 py-3 md:px-6 mobile:px-3">
                <StatsTable statsList={statsList} />
            </div> */}
            <div className="rounded-lg border mt-5 py-3 md:px-6 mobile:px-3">
                <StudentsInfoTable students={studentsData} isTeacher />
            </div>
            {isAddStudentModalOpen && (
                <div className="fixed right-0 top-0 z-50 lg:w-[30%] w-full md:w-[60%]">
                    <AddStudentModal onClose={handleCloseAddStudentModal} />
                </div>
            )}
        </section>
    );
}

export default Students;
