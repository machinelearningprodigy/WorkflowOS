"use client"

import * as React from "react"
import {
    Bell,
    Search,
    Settings,
    User,
    LogOut,
    Menu,
    ShieldCheck,
    Zap,
    ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function Header({
    user = { name: "Alex Rivera", email: "alex@workflowos.io", avatar: "AR" }
}: {
    user?: any
}) {
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header className={cn(
            "sticky top-0 z-40 w-full transition-all duration-300 px-6 h-16 flex items-center justify-between",
            isScrolled ? "bg-background/80 backdrop-blur-xl border-b shadow-sm" : "bg-transparent"
        )}>
            <div className="flex items-center gap-6 flex-1">
                <div className="hidden md:flex relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search workflows, logs, or people..."
                        className="pl-9 h-10 rounded-full bg-muted/30 border-none transition-all focus:bg-muted/50 focus:w-96"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                        <kbd className="h-5 px-1.5 rounded bg-background border text-[10px] font-bold text-muted-foreground shadow-sm">⌘</kbd>
                        <kbd className="h-5 px-1.5 rounded bg-background border text-[10px] font-bold text-muted-foreground shadow-sm">K</kbd>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 mr-4 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                    <Zap className="h-3.5 w-3.5 text-primary fill-current" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Pro Plan</span>
                </div>

                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full bg-muted/20">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background ring-offset-0" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative flex items-center gap-2 p-1 pl-1 pr-3 h-10 rounded-full hover:bg-muted/50 transition-all border border-transparent hover:border-border">
                            <Avatar className="h-8 w-8 ring-2 ring-primary/5">
                                <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                                <AvatarFallback className="font-bold text-[10px]">{user.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="hidden md:flex flex-col items-start leading-none gap-0.5">
                                <span className="text-xs font-bold tracking-tight">{user.name}</span>
                                <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest leading-none">Admin</span>
                            </div>
                            <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 border-2 shadow-2xl p-2 mt-2">
                        <div className="px-2 py-3 mb-2 flex flex-col gap-0.5">
                            <p className="text-sm font-bold tracking-tight">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">{user.email}</p>
                        </div>
                        <DropdownMenuSeparator className="-mx-2" />
                        <DropdownMenuItem className="py-2.5 rounded-lg gap-3">
                            <User className="h-4 w-4" /> Account Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2.5 rounded-lg gap-3">
                            <ShieldCheck className="h-4 w-4" /> Organization Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2.5 rounded-lg gap-3">
                            <Settings className="h-4 w-4" /> Preferences
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="-mx-2" />
                        <DropdownMenuItem className="py-2.5 rounded-lg gap-3 text-destructive focus:bg-destructive/10 focus:text-destructive font-bold">
                            <LogOut className="h-4 w-4" /> Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
