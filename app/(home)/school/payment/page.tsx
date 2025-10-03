import React from 'react';
import { Metadata } from 'next';
import Payment from '@/app/modules/school-paymentPage/Payment';

export const metadata: Metadata = {
    title: 'Payments',
    description: 'Here’s Your Payment Information',
};

function PaymentPage() {
    return <Payment />;
}

export default PaymentPage;
