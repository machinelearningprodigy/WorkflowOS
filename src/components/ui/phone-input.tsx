"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function PhoneInput({
    value,
    onChange,
    className,
}: {
    value: string
    onChange: (val: string) => void
    className?: string
}) {
    return (
        <div className={cn("flex gap-2", className)}>
            <Select defaultValue="+1">
                <SelectTrigger className="w-[80px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                </SelectContent>
            </Select>
            <Input
                type="tel"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Phone number"
                className="flex-1"
            />
        </div>
    )
}
