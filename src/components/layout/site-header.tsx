"use client"

import { NotificationBell } from "@/components/notifications/notification-bell"
import { UserMenu } from "@/components/shared/user-menu"
import { SearchBar } from "@/components/shared/search-bar"
import { Button } from "@/components/ui/button"
import { Plus, Zap } from "lucide-react"

export function SiteHeader() {
    return (
        <header className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center gap-8 flex-1">
                <div className="md:hidden flex items-center gap-2">
                    <Zap className="h-6 w-6 text-indigo-600" />
                    <span className="font-black text-slate-900">OS</span>
                </div>
                <div className="hidden md:block w-full max-w-sm">
                    {/* Placeholder for SearchBar implementation or integration */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full h-11 pl-10 pr-3 py-2 border-2 border-slate-50 bg-slate-50 rounded-2xl leading-5 text-slate-600 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 sm:text-sm font-bold transition-all"
                            placeholder="Global Search (Ctrl + K)"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button className="hidden sm:flex bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-5 font-bold shadow-lg shadow-slate-100 gap-2">
                    <Plus className="h-4 w-4" /> New Workflow
                </Button>

                <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block" />

                <NotificationBell />
                <UserMenu />
            </div>
        </header>
    )
}
