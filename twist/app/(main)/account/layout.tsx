import AccountSidebar from './_components/AccountSidebar';

export default function DashboardLayout({
    children,
<<<<<<< Updated upstream
  }: {
    children: React.ReactNode
  }) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
        <div className="h-full w-1/5 flex flex-col justify-center border-r border-border">
            <Button className='m-2 justify-start'>Twoje dane</Button>
            <Button className='m-2 justify-start' variant="ghost">Bezpieczeństwo</Button>
            <Button className='m-2 justify-start' variant="ghost">Statystyki</Button>
            <Button className='m-2 justify-start' variant="ghost">Wyloguj</Button>
        </div>        

        {children}
    </div>
  )
=======
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <AccountSidebar />
            {children}
        </div>
    );
>>>>>>> Stashed changes
}
