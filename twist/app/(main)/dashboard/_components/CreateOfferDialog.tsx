"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createOfferSchema } from '@/schemas';
import { useState, useTransition } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { JobType } from '@prisma/client';
import { createOffer } from '@/actions/offer';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/icons';

export default function CreateOfferDialog() {
    const [isPending, startTransition] = useTransition();
    const [opened, setOpened] = useState(false);

    const form = useForm<z.infer<typeof createOfferSchema>>({
        resolver: zodResolver(createOfferSchema),
        defaultValues: {
            jobTitle: '',
            jobType: undefined,
            location: '',
            salary: undefined,
            responsibilities: undefined,
        },
    });

    const onSubmit = (values: z.infer<typeof createOfferSchema>) => {
        startTransition(async () => {
            const res = await createOffer(values);
            if (res?.data?.success) {
                toast.success(res.data.success);
                setOpened(false);
            } else if (res?.data?.failure) {
                toast.error(res?.data?.failure);
            }
        });
    };

    return (
        <Dialog open={opened} onOpenChange={setOpened}>
            <DialogTrigger>
                <Button variant="outline"><Icons.Plus className='w-4 h-4 mr-2' />Dodaj nową ofertę</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stwórz ofertę</DialogTitle>
                    <DialogDescription>Wypełnij poniższe pola, aby stworzyć nową ofertę</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='grid gap-4'
                    >
                        <FormField
                            control={form.control}
                            name='jobTitle'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nazwa stanowiska</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder='' type='text' autoComplete='' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='jobType'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tryb pracy</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="Wybierz tryb pracy" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={JobType.ONSITE}>Stacjonarnie</SelectItem>
                                            <SelectItem value={JobType.REMOTE}>Zdalnie</SelectItem>
                                            <SelectItem value={JobType.HYBRID}>Hybrydowo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='location'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lokalizacja</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder='' type='' autoComplete='' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='salary'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Zarobki</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder='' type='' autoComplete='' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='responsibilities'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Obowiązki</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder='' type='' autoComplete='' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full mt-4" disabled={isPending}>
                            Utwórz ofertę
                            {isPending && <Icons.Loading className="animate-spin w-4 h-4 ml-2" />}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
