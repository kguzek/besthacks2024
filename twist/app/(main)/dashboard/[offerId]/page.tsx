import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function OfferIdPage({ params }: { params: { offerId: string } }) {
    const offer = await prisma.offer.findUnique({
        where: {
            id: params.offerId
        }
    })
    if (!offer) return notFound()

    return (
        <div className='container mx-auto h-5/6 pt-10 pl-6 flex gap-10'>
            <div className='flex flex-col gap-2 flex-1 max-w-2xl'>
                <h1 className='text-2xl font-bold font-cal'>Oferta pracy: {offer.jobTitle}</h1>
                
                <div className='flex flex-col gap-2 flex-1 max-w-xl'>
                    <div className='flex items-center justify-between'>
                        <p className='text-muted-foreground text-base'>Lokalizacja</p>
                        <h1 className='font-cal translate-y-[1px] text-xl'>{offer.location}</h1>
                    </div>

                    <div className='flex items-center justify-between'>
                        <p className='text-muted-foreground text-base'>Zarobki</p>
                        <h1 className='font-cal translate-y-[1px] text-xl'>{offer.salary}</h1>
                    </div>

                    <div className='flex items-center justify-between'>
                        <p className='text-muted-foreground text-base'>Tryb pracy</p>
                        <h1 className='font-cal translate-y-[1px] text-xl'>{offer.jobType}</h1>
                    </div>

                    <div className='flex items-center justify-between'>
                        <p className='text-muted-foreground text-base'>Obowiązki</p>
                        <h1 className='font-cal translate-y-[1px] text-xl'>{offer.responsibilities}</h1>
                    </div>
                </div>
            </div>

            <div className=''>
                <h1 className='font-cal text-2xl'>Dopasowani pracownicy</h1>

                <div className='mt-5 flex flex-col gap-2'>
                    {offer.selectedCandidates.map(candidate => (
                        <div className='flex items-center' key={candidate.idx}>
                            <h1 className='font-cal text-xl'>{candidate.name}</h1>
                            <p className='text-muted-foreground text-base'>{candidate.email}</p>
                        </div> 
                    ))}
                </div>
            </div>
        </div>
    )
}
