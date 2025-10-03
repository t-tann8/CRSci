import React, { ChangeEvent } from 'react';
import { Filter, Upload } from 'lucide-react';

interface AppInputProps {
    type?: string;
    id?: string;
    placeholder?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    additionalClasses?: string;
    name?: string;
}

function AppInput({
    type = 'text',
    id,
    placeholder = '',
    onChange,
    additionalClasses = '',
    name,
}: AppInputProps): JSX.Element {
    return (
        <input
            className={` mt-1 block w-full px-3 py-3 bg-slate-100 border rounded-md text-sm shadow-sm placeholder-slate-400
                             focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${additionalClasses}`}
            type={type}
            id={id}
            placeholder={placeholder}
            onChange={onChange}
        />
    );
}

export default AppInput;
