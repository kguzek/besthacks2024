'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateProfileSchema } from '@/schemas';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Icons } from '@/components/icons';
import { useState, useTransition } from 'react';
import { JobHoursTime, JobType, User } from '@prisma/client';
import { updateProfile } from '@/actions/profile';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

export default function AccountDetails({ user }: { user: User }) {
    const [isPending, startTransition] = useTransition();

    const [error] = useState<string | null>(null);

    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            githubLink: user.githubLink!,
            preferredHours: user.preferredHours!,
            jobType: user.jobType!,
            location: user.location!,
            jobTitle: user.jobTitle!,
            preferredSalary: user.preferredSalary ? user.preferredSalary.toString() : '',
        },
    });

    const onSubmit = (values: z.infer<typeof updateProfileSchema>) => {
        startTransition(async () => {
            const res = await updateProfile(values);
            console.log(res);
            if (res?.data?.success) {
                toast.success(res.data.success);
                // setTimeout(() => {
                //   router.push("/auth/login");
                // }, 1500);
            }
            if (res?.data?.failure) {
                toast.error(res.data.failure);
            }
        });
    };

    return (
        <div className="flex-grow h-4/6 flex items-start justify-center">
            <Card className="mx-20 w-full mb-20">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Uzupełnij swoje dane
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-100 text-red-700 p-2 mb-4 text-sm rounded-md font-medium">
                            {error}
                        </div>
                    )}
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid gap-4">
                            <div className='grid grid-cols-2 gap-5'>
                                <FormField
                                    control={form.control}
                                    name="githubLink"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel className='mb-2'>Github link</FormLabel>
                                            <FormControl>
                                                {field.value ? (
                                                    <Button disabled><Icons.Github className='w-4 h-4 mr-2' />Potwierdzono profil GitHub: {user.githubLink?.split("/").pop()}</Button>
                                                ) : (
                                                    <Button type="button" onClick={() => signIn("github")}><Icons.Github className='w-4 h-4 mr-2' />Zaloguj się przez GitHub</Button>
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="preferredHours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Preferowane godziny pracy
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="">
                                                        <SelectValue placeholder="Wybierz godziny " />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem
                                                        value={JobHoursTime.FULL}>
                                                        Pełen etat
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={JobHoursTime.PART}>
                                                        Pół etatu
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={JobHoursTime.MINI}>
                                                        Minimalne godziny
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-5'>
                                <FormField
                                    control={form.control}
                                    name="jobType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Wybierz tryb pracy
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="">
                                                        <SelectValue placeholder="Tryb pracy " />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem
                                                        value={JobType.ONSITE}>
                                                        Stacjonarnie
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={JobType.REMOTE}>
                                                        Zdalnie
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lokalizacja</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Wrocław"
                                                    type=""
                                                    autoComplete=""
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-5'>
                                <FormField
                                    control={form.control}
                                    name="jobTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stanowisko</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder=""
                                                    type=""
                                                    autoComplete=""
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="preferredSalary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Preferowana średnia płaca</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder=""
                                                    type="number"
                                                    autoComplete=""
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-8"
                                disabled={isPending}>
                                Prześlij dane
                                {isPending ? (
                                    <Icons.Loading className="animate-spin w-4 h-4 ml-2" />
                                ) : (
                                    <Icons.Right className="w-4 h-4 ml-2" />
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
