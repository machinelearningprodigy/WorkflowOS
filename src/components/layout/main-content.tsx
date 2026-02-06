"use client"

import { Breadcrumbs } from "@/components/shared/breadcrumbs"

export function MainContent({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex-1 min-w-0 bg-slate-50/50 min-h-screen">
            <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
                <Breadcrumbs />
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </div>
        </main>
    )
}
