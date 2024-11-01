/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
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

export function DataTable({
    data,
}: { data: Offer[] }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    const route = useRouter();

    return (
        <div className="w-full rounded-md border">
            <Table>
                <TableHeader className='bg-muted/20'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className='cursor-pointer'
                                onClick={() => route.push("/dashboard/"+(row.original as any).id)}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
