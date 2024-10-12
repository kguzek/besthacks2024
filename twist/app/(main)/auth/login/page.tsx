import { SignedIn, SignedOut } from '@/components/auth/session-manager'
import React from 'react'

export default function page() {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
        <SignedIn>okk</SignedIn>
        <SignedOut>
            <div>
                
            </div>
        </SignedOut>
    </div>
  )
}
