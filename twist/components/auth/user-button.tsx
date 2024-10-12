'use client';

import React, { useMemo } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import UserAvatar from './user-avatar';
import { Icons } from '../icons';
import SignOutButton from './signout-component';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { UserRole } from '@prisma/client';
import { cn } from '@/lib/utils';

export default function UserButton({ className }: { className?: string }) {
    const { data } = useSession();
    const [opened, setOpened] = React.useState(false);

    const initials = useMemo(() => {
        if (!data || !data.user || !data.user.name) return '';
        const [first, last] = data.user.name.split(' ');
        if (!last) return `${first[0]}${first[1]}`;
        return `${first[0]}${last[0]}`;
    }, [data]);
    
    return (
        <DropdownMenu open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger asChild>
                <Avatar className={cn('cursor-pointer', className)}>
                    <AvatarImage
                        src={data?.user?.image || ''}
                        alt={data?.user?.name || ''}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className="w-96 rounded-2xl p-0 shadow-md">
                <div className='w-full flex flex-col items-center bg-muted/50'>
                    <div className='flex items-center w-full p-4 gap-2 bg-background'>
                        <UserAvatar />
                        <div className='flex items-start gap-3'>
                            <div className='flex flex-col gap-1'>
                                <h1 className='font-cal text-lg leading-none translate-y-0.5'>{data?.user.name}</h1>
                                <p className='text-sm font-normal leading-none'>{data?.user.email}</p>
                            </div>
                        </div>
                    </div>
                    <Link href='/account' className='w-full'>
                        <button className='p-4 flex items-center gap-3 w-full py-4 bg-background hover:bg-muted/50 transition-all border-t' onClick={() => setOpened(false)}>
                            <div className='w-[40px] mr-1 flex items-center justify-center'><Icons.Settings className='w-4 h-4' /></div>
                            <h2 className='text-sm font-medium'>Twoje konto</h2>
                        </button>
                    </Link>
                    {data?.user.role === UserRole.ADMIN && (
                        <Link href='/admin' className='w-full'>
                            <button className='p-4 flex items-center gap-3 w-full py-4 bg-background hover:bg-muted/50 transition-all border-t' onClick={() => setOpened(false)}>
                                <div className='w-[40px] mr-1 flex items-center justify-center'><Icons.Crown className='w-4 h-4' /></div>
                                <h2 className='text-sm font-medium'>Panel Administratora</h2>
                            </button>
                        </Link>
                    )}
                    <SignOutButton asChild>
                        <button className='p-4 flex items-center gap-3 w-full py-4 rounded-b-lg bg-background hover:bg-muted/50 transition-all shadow-sm dark:hover:shadow-black/50 border-t border-b'>
                            <div className='w-[40px] mr-1 flex items-center justify-center'><Icons.LogOut className='w-4 h-4' /></div>
                            <h2 className='text-sm font-medium'>Wyloguj się</h2>
                        </button>
                    </SignOutButton>
                    <div className='p-4 flex items-center gap-3 w-full py-2.5 justify-center'>
                        <p className='text-xs font-medium translate-y-[1px]'>Secured by <Link href="/" className='font-cal'>🔒 MysticPay</Link></p>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
