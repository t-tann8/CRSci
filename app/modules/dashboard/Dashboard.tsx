'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import SlideShowIcon from '@/app/assets/icons/SlideShowIcon';
import DataIcon from '@/app/assets/icons/DataIcon';
import UserIcon from '@/app/assets/icons/UserIcon';
import ResourceIcon from '@/app/assets/icons/ResourceIcon';
import WavingHandIcon from '@/app/assets/icons/WavingHand';
import { Resource, LearningInterface } from '@/lib/utils';
import DashboardGraph from '@/app/components/common/DashboardGraph';
import UsersTable, { User } from '../users/UsersTable';
import ResourcesTable from '../resources/ResourcesTable';
import Card from '../../components/common/Card';
import Searchbar from '../../components/common/Searchbar';
import LearningPlanTable from './LearningPlanTable';
import StudentsInfoTable from '../students/StudentsInfoTable';

function Dashboard({
    name,
    isTeacher,
    AdminSummaries,
    UserAPIData,
    ResourceAPIData,
    TeacherSummaries,
    StandardOverview,
    students,
}: {
    name?: string;
    isTeacher?: boolean;
    AdminSummaries?: {
        usersCount: number;
        videosCount: number;
        resourcesCount: number;
        usersJoining: any[];
    };
    UserAPIData?: { users: User[]; totalUsers: number; totalPages: number };
    ResourceAPIData?: {
        resources: Resource[];
        totalResources: number;
        totalPages: number;
    };
    TeacherSummaries?: {
        totalStudents: number;
        totalClassrooms: number;
        OverallPerformance: string;
        usersJoining: any[];
    };
    StandardOverview?: LearningInterface[];
    students?: any[];
}) {
    const [currentYear, setCurrentYear] = React.useState(
        new Date().getFullYear()
    );

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setCurrentYear(+e.target.value);
    }

    const filteredStudents = students?.map((student) => ({
        ...student,
        id: student?.userId,
        name: student?.userName,
        email: student?.userEmail,
        image: student?.image,
        gradeId: student?.classId,
        grade: student?.className,
        performance: student?.totalObtainedScore,
    }));
    return (
        <section className="flex flex-col w-full scroll-smooth mobile:mt-2">
            <Searchbar
                headerText={`Hello, ${
                    name ? name.charAt(0).toUpperCase() + name.slice(1) : 'User'
                }!`}
                tagline="Here’s a Quick Overview"
                Icon={WavingHandIcon}
            />
            <div className="grid grid-col-1 sm:grid-cols-2  gap-4 mt-4 mobile:place-items-center mb-4 lg:grid-cols-3">
                {!isTeacher ? (
                    <>
                        <Card
                            Icon={UserIcon}
                            cardText="Total Users"
                            count={AdminSummaries?.usersCount ?? 0}
                            currentPath="/admin/users"
                            iconBackgroundColour="bg-indigo-100"
                        />
                        <Card
                            Icon={SlideShowIcon}
                            cardText="Video Uploads"
                            count={AdminSummaries?.videosCount ?? 0}
                            currentPath="/admin/video"
                            iconBackgroundColour="bg-cyan-200"
                            iconViewBox="-7 1 37 22"
                            iconColor="#0772d2"
                        />
                        <Card
                            Icon={ResourceIcon}
                            cardText="Total Resources"
                            count={AdminSummaries?.resourcesCount ?? 0}
                            currentPath="/admin/resources"
                            iconBackgroundColour="bg-amber-100"
                            iconViewBox="-7 1 37 22"
                        />
                    </>
                ) : (
                    <>
                        <Card
                            Icon={UserIcon}
                            cardText="Total Students"
                            count={TeacherSummaries?.totalStudents ?? 0}
                            currentPath="/teacher/students"
                            iconBackgroundColour="bg-indigo-100"
                        />
                        <Card
                            Icon={SlideShowIcon}
                            cardText="Assigned Classroom"
                            count={TeacherSummaries?.totalClassrooms ?? 0}
                            currentPath="/teacher/classroom"
                            iconBackgroundColour="bg-cyan-200"
                            iconViewBox="-7 1 37 22"
                            iconColor="#0772d2"
                        />

                        <Card
                            Icon={DataIcon}
                            cardText="Overall Performance"
                            count={`${TeacherSummaries?.OverallPerformance}%`}
                            currentPath="/teacher/learning-plans"
                            iconBackgroundColour="bg-orange-100"
                        />
                    </>
                )}
            </div>
            {(isTeacher &&
                (!TeacherSummaries?.usersJoining ||
                    TeacherSummaries?.usersJoining?.length > 0)) ||
            (!isTeacher &&
                (!AdminSummaries?.usersJoining ||
                    AdminSummaries?.usersJoining?.length > 0)) ? (
                <>
                    <div className="flex justify-between items-center my-3">
                        <h3 className="text-xl font-semibold mobile:mb-2">
                            All Users Count
                        </h3>
                        <select
                            className="select-wrapper"
                            onChange={handleChange}
                            value={currentYear}
                        >
                            <option value={new Date().getFullYear()}>
                                {new Date().getFullYear()}
                            </option>
                            <option value={new Date().getFullYear() - 1}>
                                {new Date().getFullYear() - 1}
                            </option>
                            <option value={new Date().getFullYear() - 2}>
                                {new Date().getFullYear() - 2}
                            </option>
                        </select>
                    </div>
                    <div className="w-full">
                        <DashboardGraph
                            data={
                                isTeacher
                                    ? TeacherSummaries?.usersJoining
                                    : AdminSummaries?.usersJoining
                            }
                            year={currentYear}
                        />
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-72 bg-white rounded-lg shadow-lg">
                    <ShieldAlert size={48} />
                    <p className="text-lg font-semibold mt-4">
                        No Students to Show
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-4 mobile:gap-8 mt-5">
                {!isTeacher ? (
                    <div className="border rounded-lg p-4 px-6">
                        <h1 className="text-xl font-semibold mb-2">Users</h1>
                        <UsersTable
                            users={UserAPIData?.users ?? []}
                            fontSize="12"
                            isDashboard
                        />
                    </div>
                ) : (
                    <div className="border rounded-lg p-4 px-6">
                        <h1 className="text-xl font-semibold mb-2">
                            All Student’s
                        </h1>
                        <StudentsInfoTable
                            students={filteredStudents ?? []}
                            isTeacherDashboardTable
                            fontSize="12"
                        />
                    </div>
                )}

                {!isTeacher ? (
                    <div className="border rounded-lg p-4 px-6">
                        <h1 className="text-xl font-semibold mb-2">
                            Resources
                        </h1>
                        <ResourcesTable
                            resources={ResourceAPIData?.resources ?? []}
                            fontSize="12"
                            isDashboard
                        />
                    </div>
                ) : (
                    <div className="border rounded-lg p-4 px-6">
                        <h1 className="text-xl font-semibold mb-2">
                            Learning Plan
                        </h1>
                        <LearningPlanTable
                            learnings={StandardOverview ?? []}
                            fontSize="12"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

export default Dashboard;
