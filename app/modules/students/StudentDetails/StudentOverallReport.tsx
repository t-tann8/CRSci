import React from 'react';
import StudentsRecordTable from '../StudentsRecordTable';

interface SummarizedStandardResult {
    standardId: string;
    standardName: string;
    totalResources: number;
    finishedResources: number;
}

function StudentOverallReport({
    studentRecord,
}: {
    studentRecord: SummarizedStandardResult[];
}) {
    return (
        // student overall performance and student report
        // <div className="mt-8 font-semibold text-xl flex flex-col lg:flex-row">
        //     <div className="w-full lg:w-[50%] lg:mr-8 ">
        //         <Filters
        //             text="Overall Performance"
        //             textColor="text-black"
        //             isHideFirstBtn
        //             isHideSecondBtn
        //         />
        //         <div className="mt-5">
        //             <Image
        //                 src={graphImage}
        //                 alt="Graph"
        //                 width={521}
        //                 height={200}
        //                 className="w-full"
        //             />
        //         </div>
        //     </div>
        <div className="w-full">
            <div className=" flex flex-col md:flex-row justify-between mt-10 md:mt-3 items-center md:items-start">
                <h1>Student Report</h1>
            </div>
            <div className="rounded-lg border mt-5 py-3 md:px-6 mobile:px-3">
                <StudentsRecordTable students={studentRecord} />
            </div>
        </div>
        // </div>
    );
}

export default StudentOverallReport;
