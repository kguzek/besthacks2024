import React from 'react'
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <>
        <nav className='w-full h-20 flex items-center'>
            <h1>Navbar</h1>
            <Button className='ml-auto'>ok</Button>
        </nav>
        {children}
    </>
  )
}
