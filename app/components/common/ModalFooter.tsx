import React from 'react';
import ButtonLoader from './ButtonLoader';

function ModalFooter({
    text,
    loading,
    buttonType,
    disabled,
}: {
    text: string;
    loading?: boolean;
    buttonType?: 'submit' | 'button';
    disabled?: boolean;
}) {
    return (
        <div className="absolute bottom-0 left-0 w-full p-3 md:py-5 lg:py-3 border bg-white">
            <button
                className={` ${
                    !disabled && 'cursor-pointer'
                } p-3 w-full rounded-lg bg-primary-color text-white text-center`}
                type={buttonType === 'button' ? 'button' : 'submit'}
                disabled={loading || disabled}
            >
                {loading ? <ButtonLoader /> : text}
            </button>
        </div>
    );
}

export default ModalFooter;
