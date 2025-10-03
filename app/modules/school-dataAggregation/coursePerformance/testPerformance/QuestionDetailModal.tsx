import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react'; // Assuming you have an icon library
import Avatar from '@/app/assets/images/UserImage.svg';
import Link from 'next/link';
import { StudentCardInterface } from './StudentCard';

interface Props {
    resourceData: {
        statement: string;
        name: string;
        answers: any[]; // Adjust type as per actual API response
        totalMarks: number;
        AssessmentResourcesDetail: any;
        url: string;
    };
    onClose: () => void;
}

function QuestionDetailModal({ resourceData, onClose }: Props) {
    const answers = !resourceData.answers
        ? resourceData.AssessmentResourcesDetail.assessmentAnswers
        : resourceData.answers;

    const StudentsList: StudentCardInterface[] = answers.map((answer: any) => ({
        id: answer.user.id,
        image: answer.user.image || Avatar,
        name: answer.user.name || 'Anonymous',
        answerText: answer.answer, // Ensure this matches API structure
        obtainedMarks: answer.obtainedMarks, // Ensure marks are not less than 0
        userDetails: answer.user, // Store detailed user info here if needed
    }));

    const [selectedStudent, setSelectedStudent] =
        useState<StudentCardInterface | null>(null);

    const toggleStudentDetails = (student: StudentCardInterface) => {
        if (selectedStudent && selectedStudent.id === student.id) {
            setSelectedStudent(null); // Close details if already selected
        } else {
            setSelectedStudent(student); // Show details for selected student
        }
    };

    return (
        <section className="w-full bg-white h-screen py-4 shadow-lg items-center">
            <div className="h-[100%] overflow-y-auto w-full px-6">
                <div className="flex justify-between">
                    <div className="flex my-7 mr-3">
                        <p className="text-dark-gray mb-2 font-semibold text-base">
                            <span className="font-semibold text-lg text-black">
                                Q:
                            </span>{' '}
                            {resourceData.statement || resourceData.name}
                        </p>
                    </div>
                    <div className="rounded-full bg-white border p-1 cursor-pointer h-fit my-7">
                        <X size={15} onClick={onClose} />
                    </div>
                </div>

                <div className="mt-5">
                    {StudentsList?.length > 0 ? (
                        StudentsList?.map(
                            (student: StudentCardInterface, index) => (
                                <div key={student.id}>
                                    <div
                                        className="flex items-center justify-between py-4 cursor-pointer"
                                        onClick={() =>
                                            toggleStudentDetails(student)
                                        }
                                    >
                                        <div className="flex items-center cursor-pointer">
                                            <img
                                                src={student?.image || Avatar}
                                                alt={student.name}
                                                className="w-12 h-12 rounded-full mr-4"
                                            />
                                            <p className="text-lg">
                                                {student.name}
                                            </p>
                                        </div>
                                        <ChevronDown
                                            size={20}
                                            className={`cursor-pointer transform rounded-full border  ${
                                                selectedStudent &&
                                                selectedStudent.id ===
                                                    student.id
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                    {selectedStudent &&
                                        selectedStudent.id === student.id && (
                                            <div className="p-4 bg-gray-100 rounded-lg">
                                                <div className="flex items-center mb-4">
                                                    <img
                                                        src={
                                                            selectedStudent?.image ||
                                                            Avatar
                                                        }
                                                        alt={
                                                            selectedStudent.name
                                                        }
                                                        className="w-16 h-16 rounded-full mr-4"
                                                    />
                                                    <div>
                                                        <p className="text-lg">
                                                            {
                                                                selectedStudent.name
                                                            }
                                                        </p>
                                                        {selectedStudent?.userDetails && (
                                                            <p className="text-gray-600">
                                                                {
                                                                    selectedStudent
                                                                        .userDetails
                                                                        .email
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        Answer:
                                                    </h3>
                                                    {!resourceData.answers ? (
                                                        <Link
                                                            href={
                                                                answers[index]
                                                                    .answerURL
                                                            }
                                                            className="text-primary-color cursor-pointer hover:text-orange-600"
                                                        >
                                                            Download
                                                        </Link>
                                                    ) : (
                                                        <p className="text-gray-700">
                                                            {
                                                                selectedStudent?.answerText
                                                            }
                                                        </p>
                                                    )}

                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-gray-700">
                                                            Marks Obtained:{' '}
                                                        </p>
                                                        <p
                                                            className={` ${
                                                                selectedStudent?.obtainedMarks ===
                                                                -1
                                                                    ? 'text-red-500'
                                                                    : 'text-gray-700'
                                                            }`}
                                                        >
                                                            {selectedStudent?.obtainedMarks ===
                                                            -1
                                                                ? 'Not Marked'
                                                                : selectedStudent?.obtainedMarks}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    {StudentsList.length !== index + 1 && (
                                        <hr />
                                    )}
                                </div>
                            )
                        )
                    ) : (
                        <p className="text-center">No Data Found!</p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default QuestionDetailModal;
