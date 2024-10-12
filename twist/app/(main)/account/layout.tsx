import AccountSidebar from './_components/AccountSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <AccountSidebar />
            {children}
        </div>
    );
}
