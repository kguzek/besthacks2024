import React from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from './_components/DataTable';
import CreateOfferDialog from './_components/CreateOfferDialog';
import { prisma } from '@/lib/db';
import { Offer } from '@prisma/client';

export const columns: ColumnDef<Offer>[] = [
    {
        accessorKey: "jobTitle",
        header: "Stanowisko",
    },
    {
        accessorKey: "jobType",
        header: "Tryb pracy",
    },
    {
        accessorKey: "location",
        header: "Lokalizacja",
    },
    {
        accessorKey: "salary",
        header: "Zarobki",
    },
    {
        accessorKey: "responsibilities",
        header: "Obowiązki",
    }
]

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
            <DataTable columns={columns} data={data} />
        </div>
    </div>
  )
}
