import Dashboard from './_components/DashboardSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Dashboard />
            {children}
        </div>
    );
}
