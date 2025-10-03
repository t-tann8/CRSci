import React from 'react';

interface StepIndicatorProps {
    step: number;
    totalSteps: number;
}

function Steps({ step, totalSteps }: any) {
    const getCircleColor = (currentStep: number, stepNumber: number) => {
        if (currentStep === stepNumber) {
            return 'border-primary-color text-primary-color';
        }
        if (currentStep > stepNumber) {
            return 'border-primary-color text-primary-color';
        }
        return 'border-dark-gray text-dark-gray';
    };

    const getLineColor = (currentStep: number, stepNumber: number) => {
        if (currentStep > stepNumber) {
            return '#F59A3B';
        }
        return '#E7EAE9';
    };

    return (
        <div className="flex items-center justify-center">
            {Array.from({ length: totalSteps }, (_, index) => (
                <React.Fragment key={index}>
                    <div
                        className={`rounded-full border px-4 py-3 flex items-center justify-center circle-container ${getCircleColor(
                            step,
                            index + 1
                        )}`}
                    >
                        <span>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    {index + 1 < totalSteps && (
                        <svg className="w-[20%] h-1 mx-2">
                            <line
                                x1="0"
                                y1="0"
                                x2="100%"
                                y2="0"
                                stroke={getLineColor(step, index + 1)}
                                strokeWidth="2"
                            />
                        </svg>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

export default Steps;
