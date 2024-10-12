import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut } from '@/components/auth/session-manager';
import UserButton from '@/components/auth/user-button';
import { ModeToggle } from '@/components/theme-toggle';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <nav className="w-full fixed top-0 left-0 z-50 border-b border-border backdrop-blur-[12px]">
                <div className="w-11/12 flex items-center container mx-auto">
                    {/* <Icons.Logo /> */}
                    <Link href="/" className="">
                        <Image
                            src="/images/logo-dark.png"
                            alt="logos"
                            width={512}
                            height={512}
                            className="w-28 h-auto dark:hidden"
                        />
                        <Image
                            src="/images/logo-light.png"
                            alt="logos"
                            width={512}
                            height={512}
                            className="w-28 h-auto hidden dark:block"
                        />
                    </Link>

                    <Link href={'/'} className="p-6 pl-12">
                        Home
                    </Link>
                    <Link href={'/about'} className="p-6">
                        O nas
                    </Link>
                    <Link href={'/contact'} className="p-6">
                        Kontakt
                    </Link>

                    <ModeToggle />

                    <SignedIn>
                        <UserButton className="ml-4" />
                    </SignedIn>
                    <SignedOut>
                        <Link href={'/auth/login'} className="ml-4">
                            <Button className="">Login</Button>
                        </Link>
                    </SignedOut>
                </div>
            </nav>
            <div className="w-full h-screen">
                <div className="w-full h-full">{children}</div>
            </div>
        </>
    );
}
