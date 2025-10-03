import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Videos',
    description: 'Your All Videos Are Here',
};
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <section>{children}</section>;
}
