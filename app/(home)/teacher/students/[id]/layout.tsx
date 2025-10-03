'use client';

import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Searchbar from '@/app/components/common/Searchbar';
import PageLoader from '@/app/components/common/PageLoader';
import { getStudentNameEmailForTeacherAPI } from '@/app/api/student';

export default function StandardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { id: string };
}) {
    const { data } = useSession();
    const { back } = useRouter();
    const [studentInfo, setStudentInfo] = useState({ name: '', email: '' });
    const studentId = params.id;

    useEffect(() => {
        const fetchData = async () => {
            if (studentId && data && !studentInfo.name) {
                try {
                    const studentdata = await getStudentNameEmailForTeacherAPI({
                        accessToken: data?.user?.accessToken || '',
                        studentId,
                    });
                    if (!studentdata.ok) {
                        const errorData = await studentdata.json();
                        throw new Error(
                            errorData?.message ??
                                'An error occurred while fetching video data'
                        );
                    }
                    const studentResponseData = await studentdata.json();
                    const { name, email } = studentResponseData.data.student;
                    setStudentInfo({ name, email });
                } catch (error: any) {
                    toast.error(
                        error?.message ??
                            'An error occurred while fetching name of student'
                    );
                }
            }
        };

        fetchData();
    }, [studentId, data, studentInfo.name]);

    return !studentInfo.name ? (
        <PageLoader />
    ) : (
        <section>
            <Searchbar
                headerText={studentInfo.name}
                tagline={studentInfo.email}
                isShowBackArrow
                onBackClick={back}
            />
            {children}
        </section>
    );
}
