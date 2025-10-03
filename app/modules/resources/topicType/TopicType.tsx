'use client';

import React, { useState } from 'react';
import {
    HelpCircle,
    ScrollText,
    LayoutList,
    Activity,
    BookAIcon,
    FileType2,
    FileTerminal,
    Database,
} from 'lucide-react';
import Filters from '@/app/components/common/Filters';
import Card from '@/app/components/common/Card';
import SlideShowIcon from '@/app/assets/icons/SlideShowIcon';
import VideoIcon from '@/app/assets/icons/VideoIcon';
import WorksheetIcon from '@/app/assets/icons/WorksheetIcon';
import AssignmentIcon from '@/app/assets/icons/AssignmentIcon';
import UploadResourceModal from '../UploadResourceModal';

function TopicPage({
    APIdata,
}: {
    APIdata: {
        slideshowCount: number;
        videoCount: number;
        worksheetCount: number;
        quizCount: number;
        assignmentCount: number;
        labCount: number;
        stationCount: number;
        activityCount: number;
        guidedNoteCount: number;
        formativeAssessmentCount: number;
        summarizeAssessmentCount: number;
        dataTrackerCount: number;
        totalCount: number;
    };
}) {
    const [isShowUploadModal, setIsShowUploadModal] = useState(false);

    const handleOpenUploadModal = () => {
        setIsShowUploadModal(true);
    };

    const handleCloseUploadModal = () => {
        setIsShowUploadModal(false);
    };

    return (
        <section>
            <Filters
                text={`${APIdata.totalCount} Resources In Total`}
                secondButtonText="Upload Resources"
                handleClick={handleOpenUploadModal}
                isHideFirstBtn
            />
            <div className="grid mobile:grid-col-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 mobile:place-items-center">
                <Card
                    Icon={VideoIcon}
                    cardText="Total Videos"
                    count={APIdata.videoCount}
                />
                <Card
                    Icon={SlideShowIcon}
                    cardText="Slideshows"
                    count={APIdata.slideshowCount}
                />
                <Card
                    Icon={WorksheetIcon}
                    cardText="Worksheets"
                    count={APIdata.worksheetCount}
                />
            </div>
            <div className="grid mobile:grid-col-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 mobile:place-items-center">
                <Card
                    Icon={HelpCircle}
                    cardText="Quizzes"
                    count={APIdata.quizCount}
                />
                <Card
                    Icon={AssignmentIcon}
                    cardText="Assignments"
                    count={APIdata.assignmentCount}
                />
                <Card
                    Icon={ScrollText}
                    cardText="Labs"
                    count={APIdata.labCount}
                    iconColor="#F02070"
                />
            </div>
            <div className="grid mobile:grid-col-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 mobile:place-items-center">
                <Card
                    Icon={LayoutList}
                    cardText="Stations"
                    count={APIdata.stationCount}
                    iconColor="#F59A3B"
                />
                <Card
                    Icon={Activity}
                    cardText="Activities"
                    count={APIdata.activityCount}
                    iconColor="#7D0DC3"
                />
                <Card
                    Icon={BookAIcon}
                    cardText="Guided Notes"
                    count={APIdata.guidedNoteCount}
                    iconColor="#F0A020"
                />
            </div>
            <div className="grid mobile:grid-col-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 mobile:place-items-center">
                <Card
                    Icon={FileType2}
                    cardText="Formative Assessments"
                    count={APIdata.formativeAssessmentCount}
                    iconColor="#7D0DC3"
                />
                <Card
                    Icon={FileTerminal}
                    cardText="Summarize Assessments"
                    count={APIdata.summarizeAssessmentCount}
                />
                <Card
                    Icon={Database}
                    cardText="Data Trackers"
                    count={APIdata.dataTrackerCount}
                    iconColor="#F02070"
                />
            </div>
            {isShowUploadModal && (
                <div className="fixed right-0 top-0 z-50 w-[100%] md:w-[60%] lg:w-[30%]">
                    <UploadResourceModal onClose={handleCloseUploadModal} />
                </div>
            )}
        </section>
    );
}

export default TopicPage;
