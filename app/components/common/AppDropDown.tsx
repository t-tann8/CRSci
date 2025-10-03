import React from 'react';
import Input from './Input';

export interface OptionsInterface {
    label: string;
    value: string;
}

interface SelectProps {
    name: string;
    options: OptionsInterface[];
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    inputValue?: string;
}

function AppDropDown({
    name,
    options,
    value,
    onChange,
    className,
    inputValue,
}: SelectProps) {
    const selectClassName = ` pl-4 p-3 py-3 pr-8 border rounded-lg bg-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-medium ${
        className || ''
    }`;

    return (
        <div className="relative w-full">
            {options.length > 0 ? (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`${selectClassName} appearance-none w-full`}
                >
                    {options.map((option) => (
                        <option key={option?.label} value={option?.label}>
                            {option?.value}
                        </option>
                    ))}
                </select>
            ) : (
                <Input
                    name="data"
                    type="text"
                    inputValue={inputValue || 'No Data Available'}
                    disabled
                />
            )}

            {!inputValue && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg
                        className="h-4 w-4 text-slate-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            )}
        </div>
    );
}

export default AppDropDown;
