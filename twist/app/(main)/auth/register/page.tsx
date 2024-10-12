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
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signUpSchema } from '@/schemas';
import { useState, useTransition } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registerUser } from '@/actions/profile';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';

export default function RegisterForm() {
    const [isPending, startTransition] = useTransition()
    const [step, setStep] = useState(0)
    const router = useRouter()
    
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    });

    const onSubmit = (values: z.infer<typeof signUpSchema>) => {
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
            <Link href="/" className='absolute top-6 left-6'><Button variant='outline'><Icons.ArrowLeft className="w-4 h-4 mr-2" /> Go back</Button></Link>
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='grid gap-4'
                        >
                            {step === 0 && (
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
                                    </div>

                                    <Button type="button" onClick={() => setStep(1)} className="w-full">
                                        Next Step
                                    </Button>
                                </>
                            )}
                            {step === 1 && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={isPending} placeholder='john.doe@example.com' type='email' autoComplete='email' />
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
                                        Create an account
                                    </Button>
                                </>
                            )}
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
                        Already have an account?{' '}
                        <Link href="/auth/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
