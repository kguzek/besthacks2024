"use client"

import React, { useMemo } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSession } from 'next-auth/react';

export default function UserAvatar() {
    const { data } = useSession();

    const initials = useMemo(() => {
        if (!data || !data.user || !data.user.name) return '';
        const [first, last] = data.user.name.split(' ');
        if (!last) return `${first[0]}${first[1]}`;
        return `${first[0]}${last[0]}`;
    }, [data]);

    return (
        <Avatar className='mr-2'>
            <AvatarImage
                src={data?.user?.image || ''}
                alt={data?.user?.name || ''}
            />
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    )
}
