import { useMemo, useState } from 'react';

const debounce = (fn: any, delay: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => fn(...args), delay);
    };
};

export function useStateDebounced<T>(initialValue: T, delay: number) {
    const [inputValue, _setInputValue] = useState<T>(initialValue);

    const [debouncedInputValue, setDebouncedInputValue] =
        useState<T>(initialValue);

    const memoizedDebounce = useMemo(
        () =>
            debounce((value: T) => {
                setDebouncedInputValue(value);
            }, delay),
        [delay]
    );

    const setInputValue = (value: T | ((prevState: T) => T)) => {
        if (value instanceof Function) {
            _setInputValue((p) => {
                const mutated = value(p);
                memoizedDebounce(mutated);
                return mutated;
            });
        } else {
            _setInputValue(value);
            memoizedDebounce(value);
        }
    };

    return [inputValue, debouncedInputValue, setInputValue] as const;
}
