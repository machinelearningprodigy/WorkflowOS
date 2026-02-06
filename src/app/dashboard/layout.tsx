import { Sidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-background border-r transition-width duration-300">
                <Sidebar />
            </div>
            <main className="md:pl-72 pb-10 h-full bg-background transition-padding duration-300">
                {children}
            </main>
        </div>
    )
}
