import React from 'react';
import { Checkbox } from '@/app/components/ui/checkbox';

interface CheckBoxProps {
    label: string;
}

export function CheckBox({ label }: CheckBoxProps) {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox />
            <label
                htmlFor="terms"
                className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {label}
            </label>
        </div>
    );
}
