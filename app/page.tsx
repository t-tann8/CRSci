import { redirect } from 'next/navigation';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';

export default async function DefaultPage() {
    const session = await getServerSession(options);
    if (!session) {
        return redirect('/signin');
    }
    if (session && session.user && session.user.role) {
        return redirect(`/${session.user.role}`);
    }
}
