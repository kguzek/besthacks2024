'use client';

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"  
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateProfileSchema } from '@/schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Icons } from '@/components/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { JobHoursTime, JobType } from '@prisma/client';
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from './_components/DataTable';

export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "email",
        header: "Stanowisko",
    },
    {
        accessorKey: "email",
        header: "Godziny pracy",
    },
    {
        accessorKey: "amount",
        header: "Tryb pracy",
    },
    {
        accessorKey: "amount",
        header: "Lokalizacja",
    },
    {
        accessorKey: "amount",
        header: "Zarobki",
    },
    {
        accessorKey: "amount",
        header: "...",
    },
    {
        accessorKey: "status",
        header: () => <div className="text-right">Status</div>,
        cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)
    
        return <div className="text-right font-medium">{formatted}</div>
        },
    },
]

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
      {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
      },{
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
      },
      // ...
    ]
}

export default async function DashboardPage() {
    // const [isPending, startTransition] = useTransition()
    // const [error, setError] = useState<string | null>(null)

    // const form = useForm<z.infer<typeof updateProfileSchema>>({
    //     resolver: zodResolver(updateProfileSchema),
    //     defaultValues: {
    //         githubLink: '',
    //         preferredHours: undefined,
    //         jobType: undefined,
    //         location: '',
    //         jobTitle: ''
    //     }
    // });

    // const onSubmit = (values: z.infer<typeof updateProfileSchema>) => {
    //     console.log("wtf")
    // }

    const data = await getData();

    return (
    <div className='flex-grow h-4/6 flex items-start justify-center'>
        <DataTable columns={columns} data={data} />
    </div>
  )
}
