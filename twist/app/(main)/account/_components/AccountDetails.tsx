/* eslint-disable @typescript-eslint/no-explicit-any */
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
import confetti from 'canvas-confetti';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function AccountDetails({ user }: { user: User }) {
    const [isPending, startTransition] = useTransition();
    const [opened, setOpened] = useState(false);

    const [error] = useState<string | null>(null);

    const handleClick = () => {
        const end = Date.now() + 3 * 1000; // 3 seconds
        const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];

        const frame = () => {
            if (Date.now() > end) return;

            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors: colors,
            });

            requestAnimationFrame(frame);
        };

        frame();
    };

    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            githubLink: user.githubLink!,
            preferredHours: user.preferredHours!,
            jobType: user.jobType!,
            location: user.location!,
            jobTitle: user.jobTitle!,
            preferredSalary: user.preferredSalary
                ? user.preferredSalary.toString()
                : '',
        },
    });

    const onSubmit = (values: z.infer<typeof updateProfileSchema>) => {
        startTransition(async () => {
            const res = await updateProfile(values);
            if (res?.data?.success) {
                setOpened(true);
                handleClick()
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
            <Dialog open={opened} onOpenChange={setOpened}>
                <DialogContent>
                    <div className='w-full flex flex-col justify-center items-center'>
                        <Icons.Done className='text-6xl text-emerald-500 mb-6' />
                        <h1 className='text-2xl font-cal'>Uzupełniono profil!</h1>
                        <h3 className='text-muted-foreground text-base text-center text-balance mb-3'>
                            Pomyślnie odczytano profil GitHub oraz Twoje dane. Od tej pory to praca szuka ciebie!
                        </h3>

                        <ul className='list-disc list-inside my-5'>
                            {(user.skills as any).map((skill: {name: string, skill: number}, index: number) => (
                                <li key={index} className='text-base text-balance'>
                                    {skill.name} - {skill.skill}
                                </li>
                            ))}
                        </ul>

                        <Button className='mt-5 px-32' onClick={() => setOpened(false)}>Zamknij</Button>
                    </div>
                </DialogContent>
            </Dialog>
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
                            <div className="grid grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="githubLink"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="mb-2">
                                                Github link
                                            </FormLabel>
                                            <FormControl>
                                                {field.value ? (
                                                    <Button disabled>
                                                        <Icons.Github className="w-4 h-4 mr-2" />
                                                        Potwierdzono profil
                                                        GitHub:{' '}
                                                        {user.githubLink
                                                            ?.split('/')
                                                            .pop()}
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        onClick={() =>
                                                            signIn('github')
                                                        }>
                                                        <Icons.Github className="w-4 h-4 mr-2" />
                                                        Zaloguj się przez GitHub
                                                    </Button>
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
                                                        value={
                                                            JobHoursTime.FULL
                                                        }>
                                                        Pełen etat
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={
                                                            JobHoursTime.PART
                                                        }>
                                                        Pół etatu
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={
                                                            JobHoursTime.MINI
                                                        }>
                                                        Minimalne godziny
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
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
                            <div className="grid grid-cols-2 gap-5">
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
                                            <FormLabel>
                                                Preferowana średnia płaca
                                            </FormLabel>
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
