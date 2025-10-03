'use client';

import { useStateDebounced } from '@/lib/custom-hooks/useStateDebounced';
import { SearchIcon } from 'lucide-react';
import React from 'react';

function SearchInput({
    handleChange = () => {},
}: {
    handleChange?: (search: string) => void;
}) {
    const [inputValue, debouncedInputValue, setInputValue] = useStateDebounced(
        '',
        100
    );

    React.useEffect(() => {
        handleChange(debouncedInputValue);
    }, [debouncedInputValue, handleChange]);

    return (
        <div className="flex border rounded-lg px-2 mobile:pr-6 w-full justify-between items-center bg-transparent">
            <input
                type="text"
                className="p-2 border-none outline-none bg-transparent w-full mobile:w-[80%]"
                placeholder="Search..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="cursor-pointer">
                <SearchIcon width={18} height={18} />
            </div>
        </div>
    );
}

export default SearchInput;
