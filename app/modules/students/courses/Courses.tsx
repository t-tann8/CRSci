'use client';

import React from 'react';

import Pagintaion from '@/app/components/common/Pagintaion';
import CoursesTable, { CoursesListInterface } from './CoursesTable';
import TestReportModal from './TestReportModal';

export const CoursesList: CoursesListInterface[] = [
    {
        id: 1,
        testName: 'Computer',
        result: '10',
        score: '20',
    },
    {
        id: 1,
        testName: 'Computer',
        result: '10',
        score: '20',
    },
    {
        id: 1,
        testName: 'Computer',
        result: '10',
        score: '20',
    },
    {
        id: 1,
        testName: 'Computer',
        result: '10',
        score: '20',
    },
    {
        id: 1,
        testName: 'Computer',
        result: '10',
        score: '20',
    },
    {
        id: 1,
        testName: 'Computer',
        result: '10',
        score: '20',
    },
];
function Courses() {
    return (
        <div>
            <h1 className="font-bold text-xl my-6">75% Overall Performance</h1>
            <div className="border rounded-lg p-5">
                <h1 className="text-xl font-semibold">
                    Kathryn Murphy - Report
                </h1>
                <CoursesTable courses={CoursesList} />
            </div>
            <div className="flex items-center w-full justify-center mt-5">
                <Pagintaion
                    currentPage={1}
                    totalPages={4}
                    onPageChange={(page: number) => {}}
                />
            </div>
        </div>
    );
}

export default Courses;
