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

export default function DashboardPage() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            githubLink: '',
            preferredHours: undefined,
            jobType: undefined,
            location: '',
            jobTitle: ''
        }
    });

    const onSubmit = (values: z.infer<typeof updateProfileSchema>) => {
        console.log("wtf")
        // startTransition(async () => {
        //     const res = await registerUser(values);
        //     console.log(res);
        //     if (res?.data?.success) {
        //         // redirect to login
        //         toast.success("Account created successfully. Redirecting to login page...")
        //         setTimeout(() => {
        //             router.push('/auth/login')
        //         }, 1500)
        //     }
        //     if (res?.data?.failure) {
        //         toast.error(res?.data?.failure)
        //     }
        // })
    }

    return (
    <div className='flex-grow h-4/6 flex items-start justify-center'>
            <Card className="mx-20 w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">Uzupełnij swoje dane</CardTitle>    
                </CardHeader>
                <CardContent>
                    {error && <div className="bg-red-100 text-red-700 p-2 mb-4 text-sm rounded-md font-medium">{error}</div>}
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='grid gap-4'
                        >
                            <FormField
                                control={form.control}
                                name='githubLink'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Github link</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} placeholder='https://github.com/jankowalski' type='' autoComplete='' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='preferredHours'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preferowane godziny pracy</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="">
                                                    <SelectValue placeholder="Wybierz godziny " />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={JobHoursTime.FULL}>Pełen etat</SelectItem>
                                                <SelectItem value={JobHoursTime.PART}>Pół etatu</SelectItem>
                                                <SelectItem value={JobHoursTime.MINI}>Minimalne godziny</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='jobType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wybierz tryb pracy</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="">
                                                    <SelectValue placeholder="Tryb pracy " />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={JobType.ONSITE}>Stacjonarnie</SelectItem>
                                                <SelectItem value={JobType.REMOTE}>Zdalnie</SelectItem>
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
                                            <Input {...field} disabled={isPending} placeholder='Wrocław' type='' autoComplete='' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='jobTitle'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stanowisko</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} placeholder='Junior Frontend Developer' type='' autoComplete='' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full mt-8" disabled={isPending}>
                                Prześlij dane
                                {isPending ? <Icons.Loading className="animate-spin w-4 h-4 ml-2" /> : <Icons.Right className="w-4 h-4 ml-2" />}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
    </div>
  )
}
