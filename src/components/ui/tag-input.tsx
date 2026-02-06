"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function TagInput({
    value = [],
    onChange,
    placeholder = "Add tag...",
    className,
}: {
    value: string[]
    onChange: (tags: string[]) => void
    placeholder?: string
    className?: string
}) {
    const [inputValue, setInputValue] = React.useState("")

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue) {
            e.preventDefault()
            if (!value.includes(inputValue)) {
                onChange([...value, inputValue])
            }
            setInputValue("")
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            onChange(value.slice(0, -1))
        }
    }

    const removeTag = (tag: string) => {
        onChange(value.filter((t) => t !== tag))
    }

    return (
        <div className={cn("flex flex-wrap gap-2 p-1.5 rounded-md border focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", className)}>
            {value.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}
            <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? placeholder : ""}
                className="flex-1 bg-transparent border-none outline-none text-sm p-0.5 min-w-[120px]"
            />
        </div>
    )
}
