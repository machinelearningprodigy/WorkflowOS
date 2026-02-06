"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

export function LocationInput({
    value,
    onChange,
    className,
}: {
    value: string
    onChange: (val: string) => void
    className?: string
}) {
    return (
        <div className={cn("relative", className)}>
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search for an address..."
                className="pl-9"
            />
        </div>
    )
}
