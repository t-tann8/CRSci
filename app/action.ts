'use server';

import { revalidateTag } from 'next/cache';

export default async function action(tag: string) {
    revalidateTag(tag);
}
