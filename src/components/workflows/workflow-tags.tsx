"use client"

import * as React from "react"
import { Tag, X, Plus, Hash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function WorkflowTags({
    tags = [],
    onAdd,
    onRemove
}: {
    tags?: string[]
    onAdd: (tag: string) => void
    onRemove: (tag: string) => void
}) {
    const [input, setInput] = React.useState("")

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input.trim()) {
            onAdd(input.trim())
            setInput("")
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
                <Badge
                    key={tag}
                    variant="secondary"
                    className="group gap-1.5 py-1 px-3 bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-all font-mono text-[10px] uppercase tracking-wider"
                >
                    <Hash className="h-3 w-3 opacity-50" />
                    {tag}
                    <button
                        onClick={() => onRemove(tag)}
                        className="rounded-full hover:bg-primary/20 p-0.5 transition-colors"
                    >
                        <X className="h-2.5 w-2.5" />
                    </button>
                </Badge>
            ))}

            <Popover>
                <PopoverTrigger asChild>
                    <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors py-1 px-2 border border-dashed rounded-full hover:border-primary/50">
                        <Plus className="h-3 w-3" />
                        Add Tag
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" side="bottom" align="start">
                    <div className="relative">
                        <Tag className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                            placeholder="Type & Enter..."
                            className="h-8 pl-7 text-xs"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
