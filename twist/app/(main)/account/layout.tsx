import AccountSidebar from './_components/AccountSidebar';

export default function AccountLayout({
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
