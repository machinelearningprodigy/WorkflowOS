"use client"

import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function CronBuilder({
    value,
    onChange,
    className,
}: {
    value: string
    onChange: (cron: string) => void
    className?: string
}) {
    const [frequency, setFrequency] = React.useState("daily")

    // Simplified cron builder
    const handleFrequencyChange = (val: string) => {
        setFrequency(val)
        if (val === "daily") onChange("0 0 * * *")
        else if (val === "weekly") onChange("0 0 * * 0")
        else if (val === "monthly") onChange("0 0 1 * *")
        else if (val === "hourly") onChange("0 * * * *")
    }

    return (
        <div className={cn("space-y-4 rounded-md border p-4 bg-muted/50", className)}>
            <div className="space-y-2">
                <Label>Repeat</Label>
                <Select value={frequency} onValueChange={handleFrequencyChange}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="daily">Every Day</SelectItem>
                        <SelectItem value="weekly">Every Week</SelectItem>
                        <SelectItem value="monthly">Every Month</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
                Generated Cron: <span className="text-primary">{value}</span>
            </div>
        </div>
    )
}
