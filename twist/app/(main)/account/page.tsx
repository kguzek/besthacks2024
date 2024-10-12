import React from 'react'
import AccountDetails from './_components/AccountDetails'
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function AccountDetailsPage() {
    const { user } = (await auth()) ?? {};
    if (!user) return notFound();
    
    const data = await prisma.user.findUnique({ where: { id: user.id } });
    if (!data) return notFound();
    
    return (
        <AccountDetails user={data} />
    )
}
