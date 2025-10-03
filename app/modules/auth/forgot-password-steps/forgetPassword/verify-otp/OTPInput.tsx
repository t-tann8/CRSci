'use client';

import { useState } from 'react';

export function OTPInput({
    index,
    maxLength = 1,
    value,
    onChange,
    onBackspace,
    onFocusNext,
    onPaste,
}: {
    index: number;
    maxLength?: number;
    value: string;
    onChange: (value: string) => void;
    onBackspace: () => void;
    onFocusNext: () => void;
    onPaste: (pastedText: string) => void;
}) {
    const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.replace(/\D/g, '');
        onChange(inputValue.slice(0, maxLength));

        if (inputValue.length === maxLength && onFocusNext) {
            onFocusNext();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && onBackspace) {
            onBackspace();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const clipboardData = e.clipboardData || (window as any).clipboardData;
        const pastedText = clipboardData.getData('text');
        onPaste(pastedText);
    };
    return (
        <input
            id={`otpInput_${index}`}
            className="mt-1 block w-full text-center px-3 py-3 bg-slate-100 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            type="text"
            value={value}
            placeholder="-"
            maxLength={maxLength}
            onInput={handleInputValue}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
        />
    );
}
