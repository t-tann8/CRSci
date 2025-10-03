import { SelectHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';
import FormError from './FormError';
import Input from './Input';

interface SelectPropsInterface extends SelectHTMLAttributes<HTMLSelectElement> {
    name: string;
    placeholder?: string;
    rules?: Record<string, any>;
    options: { value: string; label: string }[];
    selectedOption?: string;
    additionalClasses?: string;
}

function Select({
    name,
    rules,
    options,
    disabled,
    selectedOption,
    additionalClasses,
}: SelectPropsInterface): JSX.Element {
    const { register } = useFormContext();

    return (
        <div className={`relative w-full ${additionalClasses}`}>
            {options.length > 0 ? (
                <select
                    className="pl-4 p-3 py-3 pr-8 bg-slate-100 border rounded-lg focus:outline-none focus:border-sky-500 
                focus:ring-1 focus:ring-sky-500 font-medium appearance-none w-full text-sm"
                    {...register(name, rules)}
                    defaultValue={selectedOption}
                >
                    {options?.map((option) => (
                        <option
                            key={option.label}
                            value={option.label}
                            disabled={disabled}
                        >
                            {option.value}
                        </option>
                    ))}
                </select>
            ) : (
                <Input
                    additionalClasses="!m-0 !p-0"
                    name="data"
                    type="text"
                    inputValue="No Data Available"
                    disabled
                />
            )}

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
            <FormError name={name} />
        </div>
    );
}

export default Select;
