"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInSchema } from "@/schemas";
import { loginUser } from "@/actions/login";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export default function LoginForm() {
    const [isPending, startTransition] = useTransition();

    // get error parameter from url
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error");
    const callbackUrl = searchParams.get("callbackUrl");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const firstTime = useRef(true);

    useEffect(() => {
        if (urlError === "OAuthAccountNotLinked" && firstTime.current) {
            setError(
                "Your account is linked with a different provider. Please login with the correct provider."
            );

            // remove error from url
            const urlWithoutParams =
                window.location.origin + window.location.pathname;
            router.replace(urlWithoutParams);

            firstTime.current = false;

            setTimeout(() => {
                setError(null);
            }, 5000);
        }
    }, [router, urlError]);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            callbackUrl,
        },
    });

    const onSubmit = (values: z.infer<typeof signInSchema>) => {
        startTransition(async () => {
            const res = await loginUser(values);
            if (res?.data?.failure) {
                toast.error(res.data.failure);
            }
            if (res?.data?.success) {
                toast.success(res.data.success);
            }
        });
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center relative">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
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
                            className="grid gap-4"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="m@example.com"
                                                type="email"
                                                autoComplete="username"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="********"
                                                type="password"
                                                autoComplete="new-password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isPending}
                            >
                                Continue
                                {isPending ? (
                                    <Icons.Loading className="animate-spin w-4 h-4 ml-2" />
                                ) : (
                                    <Icons.Right className="w-4 h-4 ml-2" />
                                )}
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/register" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
