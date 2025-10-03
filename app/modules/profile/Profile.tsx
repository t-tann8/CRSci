import React from 'react';
import Card from '@/app/modules/profile/ProfileCard';
import ClassroomIcon from '@/app/assets/icons/ClassroomIcon';
import StatsIcon from '@/app/assets/icons/StatsIcon';
import MyAnswersTable from '@/app/modules/profile/MyAnswersTable';
import Searchbar from '@/app/components/common/Searchbar';

interface APIdata {
    summarizedStandardResults: SummarizedStandardResult[];
    averageTotalWeightage: number;
    averageObtainedWeightage: number;
    classroomName: string;
    bestPerformingStandard: BestPerformingStandard;
}

interface SummarizedStandardResult {
    standardId: string;
    standardName: string;
    totalWeightage: number;
    obtainedWeightage: number;
}

interface BestPerformingStandard {
    standardId: string;
    standardName: string;
    obtainedWeightage: number;
}

function Profile({ APIdata }: { APIdata: APIdata }) {
    return (
        <div>
            <Searchbar
                headerText="My Profile"
                tagline="Track Of Performance & Progress"
            />
            <div className="grid  md:grid-cols-2 lg:grid-cols-3 gap-5 my-5">
                <Card
                    Icon={ClassroomIcon}
                    description={APIdata.classroomName || 'N/A'}
                    header="Classroom"
                    iconBg="bg-green-100"
                    border="border-1 border-green-600"
                    iconColor="#7AA43E"
                />
                <Card
                    Icon={StatsIcon}
                    header="Overall Performance"
                    description={`${APIdata.averageObtainedWeightage || 0} of ${
                        APIdata.averageTotalWeightage || 0
                    } %`}
                    iconBg="bg-orange-100"
                    border="border-1 border-orange-600"
                    iconColor="#F59A3B"
                />
                <Card
                    Icon={StatsIcon}
                    header="Best Performing Standard"
                    description={
                        APIdata?.bestPerformingStandard?.standardName || 'N/A'
                    }
                    iconBg="bg-slate-200"
                    border="border-1 border-slate-600"
                    iconColor="#85878D"
                />
            </div>

            <div>
                <h1 className="font-semibold text-2xl mb-4 mt-8">
                    My Standards
                </h1>

                <div className="border rounded-lg p-4 px-6 flex flex-col items-end">
                    {/* <Filters text="Select FIlters" /> */}
                    <MyAnswersTable
                        myRecord={APIdata.summarizedStandardResults}
                    />
                </div>
            </div>
        </div>
    );
}

export default Profile;
