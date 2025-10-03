import React from 'react';

function PageNotFound() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-center text-primary-color">
                <h1 className="text-7xl font-medium">404</h1>
                <p className="text-xl font-medium m-6">
                    Sorry, the page you&apos;re looking for can&apos;t be found.
                </p>
            </div>
        </div>
    );
}

export default PageNotFound;
