"use client"

import * as React from "react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Search, Zap, Plug2, FileText, Settings, User } from "lucide-react"

export function SearchBar() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group relative flex h-11 w-full max-w-sm items-center gap-3 rounded-2xl border-2 border-slate-50 bg-slate-50 px-4 text-slate-400 hover:border-indigo-100 hover:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all"
            >
                <Search className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                <span className="text-sm font-bold truncate">Global Search...</span>
                <kbd className="pointer-events-none absolute right-3 hidden h-6 select-none items-center gap-1 rounded bg-white px-1.5 font-mono text-[10px] font-black text-slate-300 sm:flex border shadow-sm">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." className="h-14 font-semibold" />
                <CommandList className="scrollbar-hide">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem className="rounded-xl p-3 cursor-pointer">
                            <Zap className="mr-3 h-4 w-4 text-indigo-600" />
                            <span className="font-bold">New Workflow</span>
                        </CommandItem>
                        <CommandItem className="rounded-xl p-3 cursor-pointer">
                            <Plug2 className="mr-3 h-4 w-4 text-pink-600" />
                            <span className="font-bold">Browse Integrations</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator className="bg-slate-100" />
                    <CommandGroup heading="Quick Actions">
                        <CommandItem className="rounded-xl p-3 cursor-pointer">
                            <Settings className="mr-3 h-4 w-4 text-slate-400" />
                            <span className="font-bold text-slate-700">Settings</span>
                        </CommandItem>
                        <CommandItem className="rounded-xl p-3 cursor-pointer">
                            <User className="mr-3 h-4 w-4 text-slate-400" />
                            <span className="font-bold text-slate-700">Team Management</span>
                        </CommandItem>
                        <CommandItem className="rounded-xl p-3 cursor-pointer">
                            <FileText className="mr-3 h-4 w-4 text-slate-400" />
                            <span className="font-bold text-slate-700">Documentation</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
