import React from 'react'
import { Button } from "@/components/ui/button"
import { Icons } from '@/components/icons'

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
                <Button className='ml-auto'>Login</Button>
            </div>            
        </nav>
        {children}
    </>
  )
}
