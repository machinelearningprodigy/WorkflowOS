"use client"

import * as React from "react"
import { Filter, SlidersHorizontal, CheckCircle2, Zap, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function IntegrationFilters() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2 shadow-sm border-border/50 bg-card/50">
                    <Filter className="h-4 w-4" />
                    Refine
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-2 shadow-xl p-2">
                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1.5 flex items-center justify-between">
                    Filter Options
                    <SlidersHorizontal className="h-3 w-3" />
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="-mx-1" />

                <div className="space-y-1 py-1">
                    <DropdownMenuLabel className="px-2 py-1 text-xs">Connection Status</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem checked className="gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Connected
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem className="gap-2">
                        <Zap className="h-3.5 w-3.5 text-amber-500" /> Pending Access
                    </DropdownMenuCheckboxItem>
                </div>

                <DropdownMenuSeparator className="-mx-1" />

                <div className="space-y-1 py-1">
                    <DropdownMenuLabel className="px-2 py-1 text-xs">Platform Category</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem checked className="gap-2">
                        <LayoutGrid className="h-3.5 w-3.5" /> All Tools
                    </DropdownMenuCheckboxItem>
                    {['AI & Automation', 'Communications', 'Data & Analytics', 'Productivity'].map(cat => (
                        <DropdownMenuCheckboxItem key={cat} className="text-xs">
                            {cat}
                        </DropdownMenuCheckboxItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
