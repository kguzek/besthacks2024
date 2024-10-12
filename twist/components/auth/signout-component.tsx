"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { signOutFunction } from '@/actions/logout'

export default function SignOutButton({ children, asChild }: { children?: React.ReactNode, asChild?: boolean }) {
    if (asChild) {
        return (
            <div
                className='w-full'
                onClick={async () => {
                    await signOutFunction()
                    // refresh
                    window.location.reload()
                }}
            >
                {children}
            </div>
        )
    }
    return (
        <form
            action={async () => {
                await signOutFunction()
            }}
        >
            <Button type="submit">{children}</Button>
        </form>
    )
}
