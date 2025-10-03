'use client';

import React from 'react';
import AttempVideoQuestion from './AttempVideoQuestion';
import AnsweredOpenVideoQuestion from './AnsweredOpenVideoQuestion';
import AnsweredVideoMCQ from './AnsweredVideoMCQ';

function VideoQuestion({
    question,
    setCurrentQuestion,
    setPlaying,
    handlePlayAfterQuestion,
    markQuestionAsAnswered,
    hideButton,
    standardId,
}: {
    hideButton?: boolean;
    question: {
        id: string;
        statement: string;
        options: { [key: string]: string };
        correctOption: string;
        correctOptionExplanation: string;
        totalMarks: number;
        attempt?: {
            id: string;
            answer: string;
            obtainedMarks: number;
        };
    };
    setCurrentQuestion: (question: null) => void;
    setPlaying: (isPlaying: boolean) => void;
    handlePlayAfterQuestion: () => void;
    markQuestionAsAnswered: () => void;
    standardId: string;
}) {
    const continueVideo = () => {
        setCurrentQuestion(null);
        setPlaying(true);
        handlePlayAfterQuestion();
    };

    return !question.attempt ? (
        <AttempVideoQuestion
            hideButton={hideButton}
            question={question}
            continueVideo={continueVideo}
            markQuestionAsAnswered={markQuestionAsAnswered}
            standardId={standardId}
        />
    ) : Object.keys(question.options).length === 0 ? (
        <AnsweredOpenVideoQuestion
            answer={question.attempt.answer ?? ''}
            answerWasCorrect={
                (question.attempt.obtainedMarks ?? 0) > question.totalMarks / 2
            }
            continueVideo={continueVideo}
        />
    ) : (
        <AnsweredVideoMCQ question={question} continueVideo={continueVideo} />
    );
}

export default VideoQuestion;
