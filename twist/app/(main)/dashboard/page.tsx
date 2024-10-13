import React from 'react'
import { DataTable } from './_components/DataTable';
import CreateOfferDialog from './_components/CreateOfferDialog';
import { prisma } from '@/lib/db';

export default async function DashboardPage() {
    const data = await prisma.offer.findMany({
        orderBy: {
            createdAt: 'desc'
        },
    });

    return (
    <div className='flex-grow h-5/6 flex items-start flex-col'>
        <div className='w-full p-12 container'>
            <div className='w-full flex justify-end mb-6'>
                <CreateOfferDialog />
            </div>
            <DataTable data={data} />
        </div>
    </div>
  )
}
