"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Settings, User, LogOut, CreditCard, Layers, ExternalLink } from "lucide-react"
import Link from "next/link"

export function UserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-xl p-0 hover:bg-slate-100 ring-offset-white focus-visible:ring-indigo-500">
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Avatar" />
                        <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold">JD</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2 rounded-[1.5rem] border-slate-200 shadow-2xl shadow-slate-200" align="end" forceMount>
                <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-black leading-none text-slate-900">John Doe</p>
                        <p className="text-xs leading-none text-slate-400 font-medium tracking-tight">john@acme.inc</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-50" />
                <div className="p-1 space-y-1">
                    <Link href="/dashboard/settings/profile">
                        <DropdownMenuItem className="rounded-xl p-2.5 cursor-pointer focus:bg-slate-50">
                            <User className="mr-3 h-4 w-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">Profile Settings</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/billing">
                        <DropdownMenuItem className="rounded-xl p-2.5 cursor-pointer focus:bg-slate-50">
                            <CreditCard className="mr-3 h-4 w-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">Billing & Subscription</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/team">
                        <DropdownMenuItem className="rounded-xl p-2.5 cursor-pointer focus:bg-slate-50">
                            <Layers className="mr-3 h-4 w-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">Organization</span>
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="rounded-xl p-2.5 cursor-pointer focus:bg-slate-50">
                        <ExternalLink className="mr-3 h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">Feedback Hub</span>
                    </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-slate-50" />
                <div className="p-1">
                    <DropdownMenuItem className="rounded-xl p-2.5 cursor-pointer focus:bg-red-50 group">
                        <LogOut className="mr-3 h-4 w-4 text-slate-400 group-hover:text-red-600" />
                        <span className="text-sm font-black text-slate-700 group-hover:text-red-600 font-bold">Log out</span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
