'use client';

// Error components must be Client Components
function UnhandledError({
    error,
    // reset,
}: {
    error: Error & { digest?: string };
    // reset: () => void;
}) {
    return (
        <div className="flex justify-center items-center min-h-96 mobile:min-h-72">
            <div className="text-center text-primary-color">
                <h1 className="mobile:text-2xl text-7xl font-medium mobile:font-bold">
                    Sorry for the Inconvenice.
                </h1>
                <p className="text-xl font-medium m-6">
                    {error?.message ||
                        'An Unexpected Error Occured, Please Try Again Later'}
                </p>
            </div>
        </div>
    );
}

export default UnhandledError;
