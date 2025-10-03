import React from 'react';
import StudentProfile from './StudentProfile';
import StudentOverallReport from './StudentOverallReport';

interface Data {
    student: Student;
    summarizedStandardResults: SummarizedStandardResult[];
}

export interface Student {
    name: string;
    email: string;
    image: string;
    classroomName: string;
    totalResourcesCount: number;
    finishedResourcesCount: number;
    classroomStudentId: string;
}

interface SummarizedStandardResult {
    standardId: string;
    standardName: string;
    totalResources: number;
    finishedResources: number;
}

function StudentDetails({ APIdata }: { APIdata: Data }) {
    return (
        <section>
            <StudentProfile student={APIdata.student} />
            <StudentOverallReport
                studentRecord={APIdata.summarizedStandardResults}
            />
        </section>
    );
}

export default StudentDetails;
