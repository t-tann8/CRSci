import React from 'react';
import { Metadata } from 'next';
import Settings from '@/app/modules/school-settings/Settings';

export const metadata: Metadata = {
    title: 'Settings',
    description: 'Manage Your Profile',
};

function SettingPage() {
    return <Settings />;
}

export default SettingPage;
