'use client';

import React from 'react';
import UnhandledError from '@/app/modules/error/UnhandledError';

function AdminError({
    error,
    // reset,
}: {
    error: Error & { digest?: string };
    // reset: () => void;
}) {
    return (
        <div>
            <UnhandledError error={error} />
        </div>
    );
}

export default AdminError;
