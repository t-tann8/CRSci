import { FileEditIcon } from 'lucide-react';
import React from 'react';
import ModalFooter from '@/app/components/common/ModalFooter';
import { ModalHeader } from '@/app/components/common/ModalHeader';
import SearchInput from '@/app/components/common/SearchInput';
import QuizCard from '@/app/components/common/QuizCard';
import quizImage from '@/app/assets/images/quizImage.svg';

const cards = [
    {
        id: '1',
        imageUrl: quizImage as string,
        Text: 'Learn Figma: Basic Fundement..',
    },
    {
        id: '2',
        imageUrl: quizImage as string,
        Text: 'Master Digital Product Design..',
    },
];

function QuizModal({ onClose }: any) {
    return (
        <section className="w-full bg-white h-screen p-4  shadow-md">
            <ModalHeader
                headerText={{
                    heading: 'Select Quiz',
                    tagline: 'Select Quiz For your plan',
                }}
                Icon={FileEditIcon}
                onClose={onClose}
            />
            <div className="mb-5">
                <SearchInput />
            </div>
            <div className="md:h-96 h-72  overflow-y-auto px-6">
                {' '}
                {cards.map((card) => (
                    <div className="mt-5" key={card.id}>
                        <QuizCard card={card} />
                    </div>
                ))}
            </div>
            <ModalFooter text="Continue" />
        </section>
    );
}

export default QuizModal;
