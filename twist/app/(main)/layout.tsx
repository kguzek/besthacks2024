import React from 'react'
import { Button } from "@/components/ui/button"
import { Icons } from '@/components/icons'
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut } from '@/components/auth/session-manager'
import UserButton from '@/components/auth/user-button'

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <>
        <nav className='w-full fixed top-0 left-0'>
            <div className='w-11/12 flex items-center container mx-auto'>
                {/* <Icons.Logo /> */}
                <Image 
                    src="/images/logo.png" 
                    alt="logos" 
                    width={512} 
                    height={512} 
                    className="w-32 h-auto"
                />
                <Link href={"#"} className='p-6'>Home</Link>
                <Link href={"#"} className='p-6'>O nas</Link>
                <Link href={"#"} className='p-6'>Kontakt</Link>
                <SignedIn>
                    <UserButton className='ml-auto'/>
                </SignedIn>
                <SignedOut>
                    <Link href={"/auth/login"} className='ml-auto'><Button className='ml-auto'>Login</Button></Link>
                </SignedOut>
            </div>            
        </nav>
        {children}
    </>
  )
}
