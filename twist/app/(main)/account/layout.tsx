import { auth } from '@/auth';
import AccountSidebar from './_components/AccountSidebar';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await auth()

    if (!user) {
        return null
    }

    if (user.user.role === UserRole.COMPANY) {
        redirect('/dashboard')
    }

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <AccountSidebar />
            {children}
        </div>
    );
}
