import { Metadata } from 'next';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
    return <section>{children}</section>;
}

export default layout;
