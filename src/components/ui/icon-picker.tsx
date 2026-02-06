"use client"

import * as React from "react"
import * as LucideIcons from "lucide-react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function IconPicker({
    value,
    onChange,
    className,
}: {
    value: string
    onChange: (iconName: string) => void
    className?: string
}) {
    const [search, setSearch] = React.useState("")

    const iconNames = Object.keys(LucideIcons).filter(
        (name) => name !== "createLucideIcon" && name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50)

    const SelectedIcon = (LucideIcons as any)[value] || LucideIcons.HelpCircle

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className={cn("h-10 w-10 p-0", className)}>
                    <SelectedIcon className="h-5 w-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3">
                <Input
                    placeholder="Search icons..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-3"
                />
                <div className="grid grid-cols-6 gap-2 max-h-[300px] overflow-y-auto pr-1">
                    {iconNames.map((name) => {
                        const Icon = (LucideIcons as any)[name]
                        return (
                            <button
                                key={name}
                                onClick={() => onChange(name)}
                                className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-accent",
                                    value === name && "bg-primary text-primary-foreground"
                                )}
                                title={name}
                            >
                                <Icon className="h-5 w-5" />
                            </button>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}
