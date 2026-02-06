"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function ColorPicker({
    color,
    onChange,
    className,
}: {
    color: string
    onChange: (color: string) => void
    className?: string
}) {
    const presets = [
        "#000000", "#ffffff", "#ef4444", "#f97316", "#f59e0b",
        "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899"
    ]

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        "h-10 w-10 rounded-md border shadow-sm transition-transform active:scale-95",
                        className
                    )}
                    style={{ backgroundColor: color }}
                />
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
                <div className="grid grid-cols-5 gap-2 mb-3">
                    {presets.map((p) => (
                        <button
                            key={p}
                            className="h-8 w-8 rounded-md border transition-transform hover:scale-105"
                            style={{ backgroundColor: p }}
                            onClick={() => onChange(p)}
                        />
                    ))}
                </div>
                <div className="flex gap-2">
                    <div
                        className="h-9 w-9 shrink-0 rounded-md border"
                        style={{ backgroundColor: color }}
                    />
                    <Input
                        value={color}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="#Hex color"
                        className="h-9"
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
