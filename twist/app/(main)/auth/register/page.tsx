"use client"

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod'
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
} from "@/components/ui/select"  
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signUpSchema } from '@/schemas';
import { useTransition } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registerUser } from '@/actions/profile';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { UserRole } from '@prisma/client';

export default function RegisterForm() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            phoneNumber: '',
            type: undefined
        }
    });

    const onSubmit = (values: z.infer<typeof signUpSchema>) => {
        console.log("wtf")
        startTransition(async () => {
            const res = await registerUser(values);
            console.log(res);
            if (res?.data?.success) {
                // redirect to login
                toast.success("Account created successfully. Redirecting to login page...")
                setTimeout(() => {
                    router.push('/auth/login')
                }, 1500)
            }
            if (res?.data?.failure) {
                toast.error(res?.data?.failure)
            }
        })
    }

    return (
        <div className='h-screen w-screen flex items-center justify-center relative'>
            <Card className="mx-auto max-w-sm">
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
                                <>
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

                                    <Button type="submit" className="w-full" disabled={isPending}>
                                        Utwórz konto
                                    </Button>
                                </>
                        </form>
                    </Form>
                    {/* <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input id="first-name" placeholder="Max" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Robinson"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" />
                        </div>
                        <Button type="submit" className="w-full">
                            Create an account
                        </Button>
                        <Button variant="outline" className="w-full">
                            Sign up with GitHub
                        </Button>
                    </div> */}
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
