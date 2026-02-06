"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const filters = [
    { label: "All", value: "all" },
    { label: "Unread", value: "unread", count: 2 },
    { label: "Workflow", value: "workflow" },
    { label: "Security", value: "security" },
    { label: "Organization", value: "org" },
]

export function NotificationFilters({
    activeFilter = "all",
    onFilterChange
}: {
    activeFilter?: string,
    onFilterChange: (val: string) => void
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
                <Button
                    key={filter.value}
                    variant="ghost"
                    onClick={() => onFilterChange(filter.value)}
                    className={cn(
                        "h-10 rounded-xl px-4 text-sm font-bold transition-all",
                        activeFilter === filter.value
                            ? "bg-slate-900 text-white hover:bg-slate-800"
                            : "text-slate-500 hover:bg-slate-100"
                    )}
                >
                    {filter.label}
                    {filter.count && (
                        <Badge className={cn(
                            "ml-2 text-[10px] h-4 px-1 border-0",
                            activeFilter === filter.value ? "bg-white/20 text-white" : "bg-indigo-600 text-white"
                        )}>
                            {filter.count}
                        </Badge>
                    )}
                </Button>
            ))}
        </div>
    )
}
