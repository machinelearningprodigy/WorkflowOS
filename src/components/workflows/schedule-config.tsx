"use client"

import * as React from "react"
import { Calendar, Globe, Clock, Info } from "lucide-react"
import { CronBuilder } from "@/components/ui/cron-builder"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export function ScheduleConfig({
    value = "* * * * *",
    onChange,
    timezone = "UTC",
    onTimezoneChange
}: {
    value?: string
    onChange: (cron: string) => void
    timezone?: string
    onTimezoneChange: (tz: string) => void
}) {
    return (
        <div className="space-y-8 rounded-xl border bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-purple-500/10 p-2 rounded-lg">
                        <Calendar className="h-4 w-4 text-purple-500" />
                    </div>
                    <h3 className="font-bold text-sm tracking-tight uppercase">Schedule Configuration</h3>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-purple-500/5 text-purple-500 border-purple-500/20">
                    AUTOMATIC TRIGGER
                </Badge>
            </div>

            <div className="space-y-6">
                <div className="space-y-2 text-center pb-4">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Execution Frequency</Label>
                    <CronBuilder value={value} onChange={onChange} />
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-6">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-xs">
                            <Globe className="h-3 w-3" /> Timezone
                        </Label>
                        <Select value={timezone} onValueChange={onTimezoneChange}>
                            <SelectTrigger className="h-9 bg-muted/40">
                                <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="UTC">UTC (Greenwich)</SelectItem>
                                <SelectItem value="EST">EST (New York)</SelectItem>
                                <SelectItem value="PST">PST (Los Angeles)</SelectItem>
                                <SelectItem value="IST">IST (New Delhi)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-xs">
                            <Clock className="h-3 w-3" /> Last Run Prediction
                        </Label>
                        <div className="h-9 rounded-md border border-dashed flex items-center px-3 bg-muted/20">
                            <p className="text-[10px] font-mono text-muted-foreground">Predicting next execution...</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-800 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-200">
                <Info className="h-5 w-5 shrink-0" />
                <p className="text-xs leading-relaxed">
                    Your workflow will automatically wake up and execute based on this schedule.
                    All timestamps in logs will be converted to your selected timezone.
                </p>
            </div>
        </div>
    )
}
