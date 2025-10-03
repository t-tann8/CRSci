import React from 'react';
import { StudentProfileResourceType } from '@/lib/utils';
import Tabs from '@/app/components/common/test-performance/Tabs';
import StudentPerformanceTable, {
    StudentPerformanceInterface,
} from './StudentPerformanceTable';

function StudentPerformance() {
    const studentsRecord: StudentPerformanceInterface[] = [
        {
            id: 1,
            learningStandard: 'Standard 03',
            question:
                'What did say as a kid when asked: What do you want to be when you grow up?',
            result: 'Fail',
        },
        {
            id: 2,
            learningStandard: 'Standard 03',
            question:
                'What did say as a kid when asked: What do you want to be when you grow up?',
            result: 'Pass',
        },
        {
            id: 3,
            learningStandard: 'Standard 03',
            question:
                'What did say as a kid when asked: What do you want to be when you grow up?',
            result: 'Fail',
        },
        {
            id: 4,
            learningStandard: 'Standard 03',
            question:
                'What did say as a kid when asked: What do you want to be when you grow up?',
            result: 'Pass',
        },
        {
            id: 5,
            learningStandard: 'Standard 03',
            question:
                'What did say as a kid when asked: What do you want to be when you grow up?',
            result: 'Pass',
        },
        {
            id: 6,
            learningStandard: 'Standard 03',
            question:
                'What did say as a kid when asked: What do you want to be when you grow up?',
            result: 'Fail',
        },
        {
            id: 7,
            learningStandard: 'Standard 03',
            question:
                'What did say as a kid when asked: What do you want to be when you grow up?',
            result: 'Pass',
        },
        {
            id: 8,
            learningStandard: 'Standard 03',
            question:
                'What did say as a kid when asked: What do you want to be when you grow up?',
            result: 'Fail',
        },
        {
            id: 9,
            learningStandard: 'Standard 03',
            question:
                'What did say as a kid when asked: What do you want to be when you grow up?',
            result: 'Pass',
        },
        {
            id: 10,
            learningStandard: 'Standard 03',
            question:
                'What did say as a kid when asked: What do you want to be when you grow up?',
            result: 'Pass',
        },
    ];
    return (
        <div className="border px-2 py-5 lg:py-5 lg:px-5 rounded-lg mt-10 ">
            <div className=" px-4 lg:px-0">
                <div className="flex flex-col lg:mb-4 lg:flex-row justify-between lg:items-center ">
                    <h1 className="text-lg font-semibold mb-4 lg:mb-0">
                        Test Performance - HealthTech
                    </h1>
                </div>
                {/* <Tabs
                    activeTab=""
                    setActiveTabLocal={() => {}}
                    tabOptions={[
                        StudentProfileResourceType.VIDEO,
                        StudentProfileResourceType.ASSESSMENT,
                    ]}
                /> */}
            </div>
            <div className="rounded-xl  mt-5 py-3 md:px-6 mobile:px-3">
                <StudentPerformanceTable students={studentsRecord} />d
            </div>
        </div>
    );
}

export default StudentPerformance;
