export const getTeacherDashboardSummariesAPI = async ({
    accessToken,
    teacherId,
}: {
    accessToken: string;
    teacherId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/getTeacherDashboardSummaries`,
        {
            headers: {
                accesstoken: accessToken,
                teacherid: teacherId,
            },
            next: {
                tags: ['getTeacherDashboardSummaries'],
            },
        }
    );

    return result;
};

export const getAdminDashboardSummariesAPI = async ({
    accessToken,
}: {
    accessToken: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/getAdminDashboardSummaries`,
        {
            headers: {
                accesstoken: accessToken,
            },
            next: {
                tags: ['getAdminDashboardSummaries'],
            },
        }
    );

    return result;
};

export const getStudentDashboardSummariesAPI = async ({
    accessToken,
    studentId,
}: {
    accessToken: string;
    studentId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/getStudentDashboardSummaries`,
        {
            headers: {
                accesstoken: accessToken,
                studentid: studentId,
            },
            next: {
                tags: ['getStudentDashboardSummaries'],
            },
        }
    );

    return result;
};
