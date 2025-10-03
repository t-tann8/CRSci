import React from 'react';
import { ChevronDown, Upload } from 'lucide-react';
import FilterIcon from '@/app/assets/icons/FilterIcon';

interface FiltersInterface {
    isHideFirstBtn?: boolean;
    isHideSecondBtn?: boolean;
    text: string;
    secondButtonText?: string;
    handleClick?: () => void;
    textColor?: string;
    options?: { value: string; label: string }[];
    handleFilterUpdate?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function Filters({
    text,
    secondButtonText,
    handleClick,
    isHideFirstBtn,
    isHideSecondBtn = false,
    textColor = 'text-dark-gray',
    options,
    handleFilterUpdate,
}: FiltersInterface): JSX.Element {
    const makeFirstNumberBold = (inputText: string) => {
        const match = inputText.match(/^\d+/);
        if (match) {
            const number = match[0];
            return (
                <span>
                    <strong className="text-xl font-bold text-black">
                        {number}
                    </strong>
                    {inputText.substring(number.length)}
                </span>
            );
        }
        return inputText;
    };

    const renderHeaderText = () => (
        <h3 className={`text-xl font-semibold ${textColor} mobile:mb-2`}>
            {makeFirstNumberBold(text)}
        </h3>
    );

    return (
        <div
            className={`flex mobile:flex-col justify-between items-center  my-3 ${
                secondButtonText?.startsWith('Upload') ||
                secondButtonText?.startsWith('Create New')
                    ? 'mobile:items-center'
                    : 'mobile:items-start'
            }`}
        >
            {renderHeaderText()}
            <div className="flex">
                {!isHideFirstBtn && (
                    <div className="cursor-pointer mr-2 p-3 border text-dark-gray rounded-lg flex items-center justify-between text-sm">
                        <FilterIcon width={15} height={15} />
                        <select
                            onChange={handleFilterUpdate}
                            className="ml-1 focus:outline-none"
                        >
                            {options?.map((option) => (
                                <option
                                    key={option?.label}
                                    value={option?.value}
                                >
                                    {option?.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {!isHideSecondBtn && (
                    <div
                        onClick={handleClick}
                        className={`px-4 py-3 cursor-pointer border rounded-lg flex items-center justify-between gap-x-2.5 text-sm hover:bg-orange-500 ${
                            secondButtonText?.startsWith('Create New') ||
                            secondButtonText?.startsWith('Upload')
                                ? 'bg-primary-color text-white' // Add your styles for the bg-yellow condition
                                : 'text-dark-gray'
                        }`}
                    >
                        {secondButtonText?.startsWith('Upload') ? (
                            <Upload width={15} height={15} />
                        ) : secondButtonText?.startsWith(
                              'Create New'
                          ) ? null : (
                            <ChevronDown width={15} height={15} />
                        )}
                        <button className="mr-1" type="button">
                            {secondButtonText || 'This year'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Filters;
