import React from 'react'
import { Button } from "@/components/ui/button"
import { Icons } from '@/components/icons'
import Link from 'next/link'

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <>
        <nav className='w-full fixed top-0 left-0'>
            <div className='w-full flex items-center container mx-auto'>
                <Icons.Logo />
                <Link href={"#"} className='p-6'>Home</Link>
                <Link href={"#"} className='p-6'>O nas</Link>
                <Link href={"#"} className='p-6'>Kontakt</Link>
                <Link href={"/auth/login"} className='ml-auto'><Button className='ml-auto'>Login</Button></Link>
            </div>            
        </nav>
        {children}
    </>
  )
}
