import React from 'react';
import { Check, X } from 'lucide-react';

interface DailyUpload {
    id: string;
    accessDate: string;
    weightage: number;
    resource: Resource;
    accessible: boolean;
    performance: number;
    yetToMarkWeightage: number;
    unAnsweredWeightage: number;
}

interface Resource {
    id: string;
    name: string;
    type: string;
    video: Video | null;
    AssessmentResourcesDetail: AssessmentDetail | null;
}

interface Video {
    id: string;
    questions: Question[];
}

interface Question {
    id: string;
    statement: string;
    totalMarks: number;
    answers: Answer[];
    options?: { [key: string]: string };
    correctOption?: string;
    correctOptionExplanation?: string;
}

interface Answer {
    obtainedMarks: number;
    answer?: string;
}

interface AssessmentDetail {
    id: string;
    totalMarks: number;
    deadline: number;
    assessmentAnswers: AssessmentAnswer[];
}

interface AssessmentAnswer {
    obtainedMarks: number;
    answerURL: string;
}

function MyAnswersModal({
    onClose,
    test,
}: {
    onClose: () => void;
    test: DailyUpload;
}) {
    return (
        <section className="w-full bg-white h-screen  py-4  shadow-lg items-center">
            <div className="h-[100%] overflow-y-auto w-full px-6">
                <div className="flex justify-between items-center">
                    <div className="flex  my-7">
                        <div className="flex flex-col ml-2">
                            <h3 className="text-xl font-semibold  mr-1">
                                {test.resource.name}
                            </h3>
                            <p className="text-sm text-dark-gray mb-2">
                                My Answer&apos;s Report
                            </p>
                        </div>
                    </div>
                    <div className="rounded-full bg-white border p-1 cursor-pointer">
                        <X size={15} onClick={onClose} />
                    </div>
                </div>

                <div className="flex   w-full">
                    <div className="p-4 border-2 border-green-600 bg-green-100 rounded-lg w-full">
                        <h1 className="font-medium">Obtained Weightage</h1>
                        <h1 className="mt-2 text-gray-600 font-semibold">
                            <span className="font-bold text-lg text-black">
                                {test.performance}
                            </span>
                        </h1>
                    </div>
                    <div className="p-4 border-2 rounded-lg w-full ml-4">
                        <h1 className="font-medium">Total Weightage</h1>
                        <h1 className="mt-2 text-gray-600 font-semibold ">
                            <span className="font-bold text-lg text-black">
                                {test.weightage}
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="flex mt-2  w-full">
                    <div className="p-4 border-2 rounded-lg w-full">
                        <h1 className="font-medium">
                            Weightage Awaiting Evaluation
                        </h1>
                        <h1 className="mt-2 text-gray-600 font-semibold">
                            <span className="font-bold text-lg text-black">
                                {test.yetToMarkWeightage}
                            </span>
                        </h1>
                    </div>
                    <div className="p-4 border-2 border-red-600 bg-red-100 rounded-lg w-full ml-4">
                        <h1 className="font-medium">Unattempted Weightage</h1>
                        <h1 className="mt-2 text-gray-600 font-semibold ">
                            <span className="font-bold text-lg text-black">
                                {test.unAnsweredWeightage}
                            </span>
                        </h1>
                    </div>
                </div>

                <hr className="my-5" />

                {test.resource?.video &&
                    test.resource.video.questions?.map((question, index) => (
                        <div key={question.id}>
                            <h1 className="font-bold">{question.statement}</h1>
                            {(!question.options ||
                                Object.keys(question.options).length === 0) && (
                                <p className="p-4 mt-2 border rounded-lg bg-gray-50">
                                    {question.answers[0]?.answer ||
                                        'No answer provided'}
                                </p>
                            )}
                            {question.options &&
                                Object.keys(question.options).length > 0 &&
                                Object.entries(question.options).map(
                                    ([key, option], optionIndex) => (
                                        <p
                                            key={key}
                                            className={`p-3 my-2 border rounded-lg font-medium ${
                                                question?.answers[0] &&
                                                question.correctOption === key
                                                    ? 'flex justify-between border-green-600 text-green-600 items-center'
                                                    : 'text-gray-500'
                                            } ${
                                                question?.answers[0] &&
                                                question?.answers[0]?.answer ===
                                                    key &&
                                                question.correctOption !== key
                                                    ? 'flex justify-between border-red-600 text-red-600 items-center'
                                                    : 'text-gray-500'
                                            }`}
                                        >
                                            {option}
                                            {question?.answers[0] &&
                                                question.correctOption ===
                                                    key && (
                                                    <Check color="green" />
                                                )}
                                            {question?.answers[0] &&
                                                question?.answers[0]?.answer ===
                                                    key &&
                                                question.correctOption !==
                                                    key && <X color="red" />}
                                        </p>
                                    )
                                )}
                            {question?.answers[0] ? (
                                question.answers[0].obtainedMarks === -1 ? (
                                    <p className="mt-2 text-dark-gray font-semibold text-center border p-2 rounded-lg">
                                        Not Marked
                                    </p>
                                ) : (
                                    <p className="mt-2 text-dark-gray font-semibold text-center border p-2 rounded-lg">
                                        Marked:{' '}
                                        <span className="text-primary-color">
                                            {question.answers[0].obtainedMarks}
                                        </span>
                                    </p>
                                )
                            ) : (
                                <p className="mt-2 text-red-600 bg-red-100 font-semibold text-center border border-red-600 p-2 rounded-lg">
                                    Not Answered
                                </p>
                            )}

                            <hr className="my-5" />
                        </div>
                    ))}
                {test.resource?.AssessmentResourcesDetail ? (
                    <div>
                        {test.resource?.AssessmentResourcesDetail
                            ?.assessmentAnswers[0]?.answerURL && (
                            <iframe
                                title={test.resource?.name}
                                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                                    test.resource?.AssessmentResourcesDetail
                                        ?.assessmentAnswers[0]
                                        ?.answerURL as string
                                )}`}
                                width="100%"
                                height="280"
                                loading="lazy"
                            />
                        )}
                        {typeof test.resource?.AssessmentResourcesDetail
                            ?.assessmentAnswers[0] !== 'undefined' ? (
                            test.resource?.AssessmentResourcesDetail
                                ?.assessmentAnswers[0]?.obtainedMarks === -1 ? (
                                <p className="mt-2 text-dark-gray font-semibold text-base border p-2 rounded-lg">
                                    Not Marked
                                </p>
                            ) : (
                                <p className="mt-2 text-dark-gray font-semibold text-center border p-2 rounded-lg">
                                    Marked:{' '}
                                    <span className="text-primary-color">
                                        {
                                            test.resource
                                                ?.AssessmentResourcesDetail
                                                ?.assessmentAnswers[0]
                                                ?.obtainedMarks
                                        }
                                    </span>
                                </p>
                            )
                        ) : (
                            <p className="mt-2 text-red-600 bg-red-100 border-red-600 font-semibold text-center border p-2 rounded-lg">
                                Not Answered
                            </p>
                        )}
                    </div>
                ) : null}
            </div>
        </section>
    );
}

export default MyAnswersModal;
