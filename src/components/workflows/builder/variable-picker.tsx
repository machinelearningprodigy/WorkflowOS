"use client"

import * as React from "react"
import { Database, Search, Variable } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const SUGGESTED_VARIABLES = [
    { label: "Execution ID", value: "{{execution_id}}", category: "System" },
    { label: "Trigger Name", value: "{{trigger_name}}", category: "System" },
    { label: "Current Date", value: "{{current_date}}", category: "DateTime" },
    { label: "Current Time", value: "{{current_time}}", category: "DateTime" },
    { label: "Webhook Body", value: "{{body}}", category: "Trigger" },
    { label: "Webhook Headers", value: "{{headers}}", category: "Trigger" },
]

export function VariablePicker({
    onSelect,
    trigger = (
        <Button variant="outline" size="sm" className="h-8 gap-2">
            <Variable className="h-4 w-4" />
            Insert Variable
        </Button>
    ),
}: {
    onSelect: (variable: string) => void
    trigger?: React.ReactNode
}) {
    const [search, setSearch] = React.useState("")

    const filtered = SUGGESTED_VARIABLES.filter(v =>
        v.label.toLowerCase().includes(search.toLowerCase()) ||
        v.value.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Popover>
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
                <div className="flex items-center border-b p-3">
                    <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search variables..."
                        className="h-8 border-none p-0 focus-visible:ring-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <ScrollArea className="h-64">
                    <div className="p-2">
                        {filtered.map((v) => (
                            <button
                                key={v.value}
                                type="button"
                                className="flex w-full items-center justify-between rounded-md p-2 text-left text-sm hover:bg-muted transition-colors"
                                onClick={() => onSelect(v.value)}
                            >
                                <div className="flex flex-col">
                                    <span className="font-semibold">{v.label}</span>
                                    <span className="text-xs text-muted-foreground font-mono">{v.value}</span>
                                </div>
                                <Badge variant="outline" className="text-[10px] uppercase px-1 h-4">
                                    {v.category}
                                </Badge>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
                <div className="border-t p-3 bg-muted/30">
                    <p className="text-[10.5px] text-muted-foreground flex items-center gap-1.5">
                        <Database className="h-3 w-3" />
                        Use variables to map data between steps.
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    )
}
