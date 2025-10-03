'use state';

import React, { useState } from 'react';
import { FileVideo, X } from 'lucide-react';
import ModalFooter from '@/app/components/common/ModalFooter';
import StudentIcon from '@/app/assets/icons/StudentIcon';
import { ModalHeader } from '@/app/components/common/ModalHeader';
import VideoIcon from '@/app/assets/icons/VideoIcon';
import MovieIcon from '@/app/assets/icons/MovieIcon';
import AppDropDown from '@/app/components/common/AppDropDown';
import { Label } from '@/app/components/ui/label';
import AppInput from '@/app/components/common/AppInput';

function AddResourceModal() {
    const [selectedOption, setSelectedOption] = useState('9th Grade - B');

    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedOption(event.target.value);
    };

    // const gradeOptions = ['9th Grade - B', '9th Grade - A'];
    const gradeOptions = [
        { label: '10th Grade - Designing', value: '10th Grade - Designing' },
        { label: '9th Grade - Designing', value: '9th Grade - Designing' },
        // Add more options as needed
    ];
    return (
        <section className="w-full bg-white h-screen py-4 px-6 shadow-lg">
            <div>
                <ModalHeader
                    headerText={{
                        heading: 'SB1 Cell Structure - Function',
                        tagline: 'Add Video to your Learning Plans',
                    }}
                    // Icon={StudentIcon}
                />

                <div className="flex space-x-2 items-center border rounded-lg p-4">
                    <MovieIcon width={40} height={40} />
                    <div>
                        <p className="font-semibold">
                            SB1a. Cell Structure _ Organelles
                        </p>
                        <p className="text-dark-gray font-medium">
                            Select Learning Plan
                        </p>
                    </div>
                </div>

                <div className="flex flex-col space-y-1 mt-5">
                    <Label className="font-semibold" htmlFor="invite">
                        Select Learning Plan
                    </Label>
                    <AppDropDown
                        name="invite"
                        options={gradeOptions}
                        value={selectedOption}
                        onChange={handleSelectChange}
                    />

                    <p className="text-right text-dark-gray font-medium">
                        Add Multiple
                    </p>
                </div>

                <div className="mt-3 w-full flex flex-col space-y-1">
                    <Label className="font-semibold" htmlFor="name">
                        Name of Resource
                    </Label>

                    <AppInput name="name" id="name" placeholder="Enter name" />
                </div>
            </div>
            <ModalFooter text="Add to Plan" />
        </section>
    );
}

export default AddResourceModal;
