"use client"

import { Button } from '@/components/ui/button'
import React from 'react'

export default function AccountSidebar() {
    return (
        <div className="h-full w-1/5 flex flex-col border-r border-border">
            <div className='pt-24 flex flex-col gap-1 pr-4'>
                <Button className='justify-start'>Twoje dane</Button>
                <Button className='justify-start' variant="ghost">Bezpieczeństwo</Button>
                <Button className='justify-start' variant="ghost">Statystyki</Button>
                <Button className='justify-start' variant="ghost">Wyloguj</Button>
            </div>
        </div>  
    )
}
