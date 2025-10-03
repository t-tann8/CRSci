import { Metadata } from 'next';
import React from 'react';
import { Session, getServerSession } from 'next-auth';
import Dashboard from '@/app/modules/dashboard/Dashboard';
import { getClassesAndCoursesAPI } from '@/app/api/classroom';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { getTeacherDashboardSummariesAPI } from '@/app/api/dashboard';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Here’s a Quick Overview',
};

export default async function Home() {
    const data: Session | null = await getServerSession(options);

    if (data) {
        try {
            const teacherDashboardResponse =
                await getTeacherDashboardSummariesAPI({
                    accessToken: data.user.accessToken,
                    teacherId: data.user.id,
                });

            const standardOverviewResponse = await getClassesAndCoursesAPI({
                accessToken: data.user.accessToken,
                teacherId: data.user.id,
            });

            const classesStandardsData = await teacherDashboardResponse.json();
            const standardOverviewData = await standardOverviewResponse.json();

            if (!teacherDashboardResponse.ok) {
                throw new Error(classesStandardsData?.message);
            }
            if (!standardOverviewResponse.ok) {
                throw new Error(standardOverviewData?.message);
            }

            return (
                <Dashboard
                    isTeacher
                    name={data.user.name}
                    TeacherSummaries={{
                        totalStudents:
                            classesStandardsData?.data?.totalStudents,
                        totalClassrooms:
                            classesStandardsData?.data?.totalClassrooms,
                        OverallPerformance: `${classesStandardsData?.data?.avgObtainedWeightage} of ${classesStandardsData?.data?.avgTotalWeightage}`,
                        usersJoining: classesStandardsData?.data?.usersJoining,
                    }}
                    StandardOverview={standardOverviewData?.data}
                    students={classesStandardsData?.data.students}
                />
            );
        } catch (error: any) {
            return (
                <UnhandledError
                    error={{
                        message: error?.message,
                        name: error?.name,
                    }}
                />
            );
        }
    }
}
