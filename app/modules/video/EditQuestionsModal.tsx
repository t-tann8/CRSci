import { toast } from 'react-toastify';
import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import {
    createVideoQuestionsAPI,
    getVideoAPI,
    updateVideoAPI,
} from '@/app/api/video';
import ModalFooter from '@/app/components/common/ModalFooter';
import { Label } from '@/app/components/ui/label';
import Input from '@/app/components/common/Input';
import Select from '@/app/components/common/DropDown';
import { timeStringToSeconds, validationError } from '@/lib/utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ErrorMessage } from '@hookform/error-message';
import { FileVideoIcon, X } from 'lucide-react';
import action from '@/app/action';
import PageLoader from '@/app/components/common/PageLoader';
import ButtonLoader from '@/app/components/common/ButtonLoader';
import { ModalHeader } from '../../components/common/ModalHeader';

const questionsTypes = [
    { label: 'open', value: 'Open' },
    { label: 'mcq', value: 'Mcq' },
];

const answerOptions = [
    { label: 'option1', value: 'option1' },
    { label: 'option2', value: 'option2' },
    { label: 'option3', value: 'option3' },
    { label: 'option4', value: 'option4' },
];

interface Option {
    [key: string]: string;
}

interface Question {
    id: string;
    videoId: string;
    statement: string;
    options: Option;
    correctOption: string;
    correctOptionExplanation: string;
    totalMarks: number;
    popUpTime: string;
    type: 'mcq' | 'open';
}

interface Topic {
    [key: string]: string;
}

interface Video {
    id: string;
    resourceId: string;
    thumbnailURL: string;
    name: string;
    videoUrl: string;
    questions: Question[];
    topics: Topic;
    duration: string;
}

interface FormValues {
    video: Video;
}

function EditQuestionsModal({
    newVideo,
    newVideoDuration,
    videoId,
    onClose,
    onButtonClick,
}: {
    newVideo?: boolean;
    newVideoDuration?: string;
    videoId: string;
    onClose: () => void;
    onButtonClick: () => void;
}) {
    const { data } = useSession();
    const questionAddedRef = useRef(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [originalVideoData, setOriginalVideoData] = useState<Video>(
        {} as Video
    );
    const methods = useForm<FormValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = methods;

    const {
        fields: questionFields,
        append: appendQuestion,
        remove: removeQuestion,
    } = useFieldArray<FormValues>({
        control,
        name: 'video.questions',
    });

    const onSubmit = async (formdata: FormValues) => {
        if (!data) {
            return;
        }

        const transformedQuestions = formdata.video.questions.map(
            (question) => ({
                // Conditionally add id if the video is not new
                ...(newVideo ? {} : { id: question.id || '' }),
                statement: question.statement,
                options: question.type === 'mcq' ? question.options : {},
                correctOption: question.correctOption,
                correctOptionExplanation: question.correctOptionExplanation,
                totalMarks: question.totalMarks,
                popUpTime: question.popUpTime,
            })
        );

        try {
            let response = null;
            setButtonLoading(true);
            if (newVideo) {
                response = await createVideoQuestionsAPI({
                    videoId,
                    questions: transformedQuestions,
                    accessToken: data?.user?.accessToken || '',
                });
            } else {
                const { name, thumbnailURL, topics } = originalVideoData;
                response = await updateVideoAPI({
                    accessToken: data?.user?.accessToken,
                    videoId,
                    name,
                    thumbnailURL,
                    questions: transformedQuestions,
                    topics,
                });
            }
            if (response.status !== 200) {
                toast.error(
                    response?.data?.message ||
                        `An error occurred while ${
                            newVideo ? `adding` : `updating`
                        } video questions`
                );
            }
            await action('getVideos');
            toast.success(
                `Video questions ${newVideo ? `added` : `updated`} successfully`
            );
            onButtonClick();
        } catch (error: any) {
            toast.error(
                error?.message ||
                    'An error occurred while updating video questions'
            );
        } finally {
            setButtonLoading(false);
        }
    };
    useEffect(() => {
        // Only proceed if data is available
        if (!data) {
            return;
        }

        if (newVideo) {
            if (questionFields.length === 0 && !questionAddedRef.current) {
                appendQuestion({
                    id: '',
                    videoId: '',
                    statement: '',
                    options: {},
                    correctOption: '',
                    correctOptionExplanation: '',
                    totalMarks: 0,
                    popUpTime: '',
                    type: 'open',
                });
                questionAddedRef.current = true;
            }
        } else {
            const getVideoData = async () => {
                setModalLoading(true);
                try {
                    const APIData = await getVideoAPI({
                        accessToken: data?.user?.accessToken,
                        videoId,
                    });

                    if (!APIData.ok) {
                        const errorData = await APIData.json();
                        throw new Error(
                            errorData?.message ??
                                'An error occurred while fetching video data'
                        );
                    }

                    const responseData = await APIData.json();
                    const videoData = responseData?.data?.video;
                    setOriginalVideoData(videoData);

                    if (videoData && videoData.questions) {
                        const initialQuestions = videoData.questions.map(
                            (question: Question) => ({
                                ...question,
                                id: String(question.id),
                                type:
                                    Object.keys(question.options).length > 0
                                        ? 'mcq'
                                        : 'open',
                            })
                        );

                        reset({ video: { questions: initialQuestions } });

                        if (initialQuestions?.length === 0) {
                            appendQuestion({
                                id: '',
                                videoId: '',
                                statement: '',
                                options: {},
                                correctOption: '',
                                correctOptionExplanation: '',
                                totalMarks: 0,
                                popUpTime: '',
                                type: 'open',
                            });
                        }
                    }
                } catch (error: any) {
                    toast.error(
                        error.message ??
                            'An error occurred while fetching video data'
                    );
                } finally {
                    setModalLoading(false);
                }
            };

            getVideoData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <section className="w-full bg-white h-screen py-4 shadow-lg">
            {modalLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="h-[90%] overflow-y-scroll w-full px-6"
                    >
                        <div>
                            <ModalHeader
                                headerText={{
                                    heading: newVideo
                                        ? 'Upload Video'
                                        : 'Edit Video',
                                    tagline: `let’s ${
                                        newVideo ? `Upload` : `Edit`
                                    } Video For Your User`,
                                }}
                                Icon={FileVideoIcon}
                                onClose={onClose}
                            />
                            {questionFields.map((question: Question, index) => (
                                <div key={question.id}>
                                    <Label
                                        htmlFor={`video.questions[${index}].statement`}
                                        className="font-semibold text-md"
                                    >
                                        {`Question ${index + 1}`}
                                    </Label>
                                    <div className="flex items-center gap-5">
                                        <Input
                                            additionalClasses="w-full"
                                            name={`video.questions[${index}].statement`}
                                            inputValue={question.statement}
                                            placeholder="Write Question"
                                            type="text"
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message:
                                                        validationError.REQUIRED_FIELD,
                                                },
                                            }}
                                        />
                                        <Select
                                            additionalClasses="!w-2/5"
                                            name={`video.questions[${index}].type`}
                                            options={questionsTypes}
                                            selectedOption={
                                                Object.keys(question.options)
                                                    .length > 0
                                                    ? 'mcq'
                                                    : 'open'
                                            }
                                        />
                                    </div>
                                    <span className="text-red-500 text-xs">
                                        <ErrorMessage
                                            errors={errors}
                                            name={`video.questions[${index}].statement`}
                                            render={({ message }) => (
                                                <p className="flex items-center">
                                                    <X
                                                        size={20}
                                                        color="#E6500D"
                                                    />
                                                    {message}
                                                </p>
                                            )}
                                        />
                                    </span>
                                    <div className="flex flex-col space-y-1 mt-2">
                                        <Label
                                            htmlFor={`video.questions[${index}].popUpTime`}
                                            className="font-semibold text-md"
                                        >
                                            Timeline
                                        </Label>
                                        <Input
                                            name={`video.questions[${index}].popUpTime`}
                                            inputValue={question.popUpTime}
                                            placeholder="Enter Question Statement"
                                            type="text"
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message:
                                                        validationError.REQUIRED_FIELD,
                                                },
                                                pattern: {
                                                    value: /^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/,
                                                    message:
                                                        'Enter the time in the format HH:MM:SS (00:00:00 - 23:59:59)',
                                                },
                                                validate: (value: string) => {
                                                    const timelineSeconds =
                                                        timeStringToSeconds(
                                                            value
                                                        );
                                                    const duration = newVideo
                                                        ? newVideoDuration ||
                                                          '00:00:00'
                                                        : originalVideoData.duration;
                                                    if (
                                                        timelineSeconds >
                                                        timeStringToSeconds(
                                                            duration
                                                        )
                                                    ) {
                                                        return `Timeline exceeds video duration ${duration}`;
                                                    }
                                                    return true;
                                                },
                                            }}
                                        />
                                        <span className="text-red-500 text-xs">
                                            <ErrorMessage
                                                errors={errors}
                                                name={`video.questions[${index}].popUpTime`}
                                                render={({ message }) => (
                                                    <p className="flex items-center">
                                                        <X
                                                            size={20}
                                                            color="#E6500D"
                                                        />
                                                        {message}
                                                    </p>
                                                )}
                                            />
                                        </span>
                                    </div>
                                    {watch(
                                        `video.questions[${index}].type` as `video.questions.${number}.type`
                                    ) === 'mcq' && (
                                        <div className="flex flex-col mt-5">
                                            <Label
                                                htmlFor={`video.questions[${index}].options.0`}
                                                className="font-semibold mt-2"
                                            >
                                                Options
                                            </Label>
                                            {Object.keys(question.options)
                                                .length > 0
                                                ? Object.keys(
                                                      question.options
                                                  ).map(
                                                      (
                                                          optionKey,
                                                          optionIndex
                                                      ) => (
                                                          <div
                                                              key={optionKey}
                                                              className="mt-2"
                                                          >
                                                              <Input
                                                                  type="text"
                                                                  placeholder="Enter Option Statement"
                                                                  inputValue={
                                                                      question
                                                                          .options[
                                                                          optionKey
                                                                      ]
                                                                  }
                                                                  name={`video.questions[${index}].options.${optionKey}`}
                                                                  rules={{
                                                                      required:
                                                                          {
                                                                              value: true,
                                                                              message:
                                                                                  validationError.REQUIRED_FIELD,
                                                                          },
                                                                  }}
                                                              />
                                                              <span className="text-red-500 text-xs">
                                                                  <ErrorMessage
                                                                      errors={
                                                                          errors
                                                                      }
                                                                      name={`video.questions[${index}].options.${optionKey}`}
                                                                      render={({
                                                                          message,
                                                                      }) => (
                                                                          <p className="flex items-center">
                                                                              <X
                                                                                  size={
                                                                                      20
                                                                                  }
                                                                                  color="#E6500D"
                                                                              />
                                                                              {
                                                                                  message
                                                                              }
                                                                          </p>
                                                                      )}
                                                                  />
                                                              </span>
                                                          </div>
                                                      )
                                                  )
                                                : [
                                                      'option1',
                                                      'option2',
                                                      'option3',
                                                      'option4',
                                                  ].map(
                                                      (
                                                          optionField,
                                                          optionIndex
                                                      ) => (
                                                          <div
                                                              key={optionField}
                                                              className="mt-2"
                                                          >
                                                              <Input
                                                                  name={`video.questions[${index}].options.${optionField}`}
                                                                  placeholder="Enter Option Statement"
                                                                  type="text"
                                                                  rules={{
                                                                      required:
                                                                          {
                                                                              value: true,
                                                                              message:
                                                                                  validationError.REQUIRED_FIELD,
                                                                          },
                                                                  }}
                                                              />
                                                              <span className="text-red-500 text-xs">
                                                                  <ErrorMessage
                                                                      errors={
                                                                          errors
                                                                      }
                                                                      name={`video.questions[${index}].options.${optionField}`}
                                                                      render={({
                                                                          message,
                                                                      }) => (
                                                                          <p className="flex items-center">
                                                                              <X
                                                                                  size={
                                                                                      20
                                                                                  }
                                                                                  color="#E6500D"
                                                                              />
                                                                              {
                                                                                  message
                                                                              }
                                                                          </p>
                                                                      )}
                                                                  />
                                                              </span>
                                                          </div>
                                                      )
                                                  )}
                                            <Label
                                                htmlFor={`video.questions[${index}].correctOption`}
                                                className="font-semibold mt-3"
                                            >
                                                Correct Option
                                            </Label>
                                            <Select
                                                name={`video.questions[${index}].correctOption`}
                                                options={answerOptions}
                                                rules={{
                                                    required: {
                                                        value: true,
                                                        message:
                                                            validationError.REQUIRED_FIELD,
                                                    },
                                                }}
                                                selectedOption={
                                                    question.correctOption ||
                                                    'option1'
                                                }
                                            />
                                            <span className="text-red-500 text-xs">
                                                <ErrorMessage
                                                    errors={errors}
                                                    name={`video.questions[${index}].correctOption`}
                                                    render={({ message }) => (
                                                        <p className="flex items-center">
                                                            <X
                                                                size={20}
                                                                color="#E6500D"
                                                            />
                                                            {message}
                                                        </p>
                                                    )}
                                                />
                                            </span>
                                            <Label
                                                htmlFor={`video.questions[${index}].correctOptionExplanation`}
                                                className="font-semibold mt-4"
                                            >
                                                Correct Answer Explanation
                                            </Label>
                                            <Input
                                                type="text"
                                                inputValue={
                                                    question.correctOptionExplanation
                                                }
                                                name={`video.questions[${index}].correctOptionExplanation`}
                                                rules={{
                                                    required: {
                                                        value: true,
                                                        message:
                                                            validationError.REQUIRED_FIELD,
                                                    },
                                                }}
                                            />
                                            <span className="text-red-500 text-xs">
                                                <ErrorMessage
                                                    errors={errors}
                                                    name={`video.questions[${index}].correctOptionExplanation`}
                                                    render={({ message }) => (
                                                        <p className="flex items-center">
                                                            <X
                                                                size={20}
                                                                color="#E6500D"
                                                            />
                                                            {message}
                                                        </p>
                                                    )}
                                                />
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex flex-col space-y-1 mt-2">
                                        <Label
                                            htmlFor={`video.questions[${index}].totalMarks`}
                                            className="font-semibold text-md"
                                        >
                                            Marks
                                        </Label>
                                        <Input
                                            name={`video.questions[${index}].totalMarks`}
                                            inputValue={question.totalMarks.toString()}
                                            placeholder="Enter Question Statement"
                                            type="number"
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message:
                                                        validationError.REQUIRED_FIELD,
                                                },
                                                pattern: {
                                                    value: /^\d+$/,
                                                    message:
                                                        'Enter only numbers',
                                                },
                                            }}
                                        />
                                        <span className="text-red-500 text-xs">
                                            <ErrorMessage
                                                errors={errors}
                                                name={`video.questions[${index}].totalMarks`}
                                                render={({ message }) => (
                                                    <p className="flex items-center">
                                                        <X
                                                            size={20}
                                                            color="#E6500D"
                                                        />
                                                        {message}
                                                    </p>
                                                )}
                                            />
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(index)}
                                        className="cursor-pointer p-2 w-full rounded-lg bg-red-500 text-white text-center mt-2 mb-5"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <div className="flex flex-row gap-4">
                                <button
                                    type="button"
                                    className="cursor-pointer p-2 w-full rounded-lg bg-primary-color text-white text-center mt-5"
                                    onClick={() =>
                                        appendQuestion({
                                            id: '',
                                            videoId: '',
                                            statement: '',
                                            options: {},
                                            correctOption: '',
                                            correctOptionExplanation: '',
                                            totalMarks: 0,
                                            popUpTime: '',
                                            type: 'open',
                                        })
                                    }
                                >
                                    Add Question
                                </button>
                                <button
                                    type="submit"
                                    className="cursor-pointer p-2 w-full rounded-lg bg-primary-color text-white text-center mt-5"
                                >
                                    {buttonLoading ? (
                                        <ButtonLoader />
                                    ) : (
                                        `Save Changes`
                                    )}
                                </button>
                            </div>
                        </div>

                        <div onClick={onButtonClick}>
                            <ModalFooter text="Next" buttonType="button" />
                        </div>
                    </form>
                </FormProvider>
            )}
        </section>
    );
}

export default EditQuestionsModal;
