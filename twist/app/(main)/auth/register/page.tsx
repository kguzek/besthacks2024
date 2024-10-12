"use client"

import Link from 'next/link';
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
import { signUpSchema } from '@/schemas';
import { useTransition, useState, useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription, } from '@/components/ui/form';
import { registerUser } from '@/actions/profile';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { format, setYear, setMonth, startOfMonth } from "date-fns"; // import date-fns helpers
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function RegisterForm() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            phoneNumber: '',
            type: undefined,
        },
    });

    const onSubmit = (values: z.infer<typeof signUpSchema>) => {
        startTransition(async () => {
            const res = await registerUser(values);
            if (res?.data?.success) {
                toast.success("Account created successfully. Redirecting to login page...");
                setTimeout(() => {
                    router.push('/auth/login');
                }, 1500);
            } else if (res?.data?.failure) {
                toast.error(res?.data?.failure);
            }
        });
    };

    // State to track the selected year, month, and date for the calendar
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); // 0-based month
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Track selected date
    const [calendarMonth, setCalendarMonth] = useState<Date>(new Date()); // Track calendar's currently displayed month

    // Update calendar when year or month changes
    useEffect(() => {
        setCalendarMonth(startOfMonth(setYear(setMonth(new Date(), selectedMonth), selectedYear))); // Update calendar to reflect selected year/month
    }, [selectedYear, selectedMonth]);

    return (
        <div className='h-screen w-screen flex items-center justify-center relative'>
            <Card className="mx-auto max-w-3xl">
                <CardHeader>
                    <CardTitle className="text-xl">Zarejestruj się</CardTitle>
                    <CardDescription>
                        Wypełnij swoje dane aby utworzyć konto
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='grid gap-4'
                        >
                            <div className='grid grid-cols-2 gap-5'>
                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Imię i nazwisko</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={isPending} placeholder='Imię i nazwisko' type='name' autoComplete='name' />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='type'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Typ konta</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="">
                                                            <SelectValue placeholder="Typ konta " />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={UserRole.APPLICANT}>Kandydat</SelectItem>
                                                        <SelectItem value={UserRole.COMPANY}>Pracodawca</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className='grid grid-cols-2 gap-5'></div>
                                </div>
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={isPending} placeholder='jan.kowalski@example.com' type='email' autoComplete='email' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='phoneNumber'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Numer telefonu</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={isPending} placeholder='123 456 789' type='tel' autoComplete='tel' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hasło (min 8 znaków)</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={isPending} placeholder='********' type='password' autoComplete='new-password' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dob"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Data urodzenia</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Wybierz datę</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <div className="flex justify-between px-4 py-2">
                                                        <Select
                                                            value={String(selectedMonth)}
                                                            onValueChange={(value) => setSelectedMonth(Number(value))}
                                                        >
                                                            <SelectTrigger className="w-24">
                                                                <SelectValue placeholder="Month" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Array.from({ length: 12 }, (_, i) => (
                                                                    <SelectItem key={i} value={String(i)}>
                                                                        {format(new Date(2000, i), "MMMM")}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <Select
                                                            value={String(selectedYear)}
                                                            onValueChange={(value) => setSelectedYear(Number(value))}
                                                        >
                                                            <SelectTrigger className="w-24 ml-2">
                                                                <SelectValue placeholder="Year" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Array.from({ length: 125 }, (_, i) => (
                                                                    <SelectItem key={i} value={String(2024 - i)}>
                                                                        {2024 - i}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            setSelectedDate(date); // Set the selected date
                                                            field.onChange(date); // Update form field
                                                        }}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        month={calendarMonth} // Update calendar month based on selected year and month
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={isPending}>
                                    Utwórz konto
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Masz już konto?{' '}
                        <Link href="/auth/login" className="underline">
                            Zaloguj się
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
