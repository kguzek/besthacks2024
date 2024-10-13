'use client';

import React from 'react'
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from './_components/DataTable';
import Link from 'next/link';

export type Offer = {
    jobTitle: string
    jobType: string
    location: string
    salary: string
    responsibilities: string
    // status: "pending" | "processing" | "success" | "failed"
}

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

async function getData(): Promise<Offer[]> {
    return [
        {
            jobTitle: "Junior gownostack",
            jobType: "Pełny etat",
            location: "Wrocław",
            salary: "1500zł",
            responsibilities: "sfsdf"
        },
    ]
}

export default async function DashboardPage() {
    const data = await getData();

    return (
    <div className='flex-grow h-4/6 flex items-start flex-col'>
        <div className='w-full p-12 container'>
            <div className='w-full flex justify-end mb-6'>
                <Link href='/createOffer'>
                    <Button variant="outline" className='p-2'><Icons.Plus /></Button>
                </Link>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    </div>
  )
}
