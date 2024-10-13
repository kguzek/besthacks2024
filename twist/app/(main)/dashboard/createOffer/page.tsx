"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { useTransition } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { JobType } from '@prisma/client';

export default function RegisterForm() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

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
        // startTransition(async () => {
        //     const res = await registerUser(values);
        //     if (res?.data?.success) {
        //         toast.success("Account created successfully. Redirecting to login page...");
        //         setTimeout(() => {
        //             router.push('/auth/login');
        //         }, 1500);
        //     } else if (res?.data?.failure) {
        //         toast.error(res?.data?.failure);
        //     }
        // });
    };

    return (
        <div className='h-screen w-screen flex items-center justify-center relative'>
            <Card className="mx-auto max-w-3xl">
                <CardHeader>
                    <CardTitle className="text-xl">Dodaj ofertę</CardTitle>
                    <CardDescription>
                        Wypełnij swoje preferencje dotyczące kandydata
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
