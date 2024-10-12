"use client"

import { useSession } from 'next-auth/react'
import React from 'react'

export function SignedIn({ children }: { children: React.ReactNode }) {
    // show only if user is signed in
    const { status } = useSession()
    if (status === "unauthenticated") return null
    return <>{children}</>
}

export function SignedOut({ children }: { children: React.ReactNode }) {
    // show only if user is signed out
    const { status } = useSession()
    if (status === "authenticated") return null
    return <>{children}</>
}