"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calculator } from "lucide-react"

export function ROICalculator() {
    const [hourlyRate, setHourlyRate] = useState(50)
    const [hoursSaved, setHoursSaved] = useState(120)

    const totalSavings = hourlyRate * hoursSaved

    return (
        <Card className="border-slate-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-indigo-600" />
                    ROI Calculator
                </CardTitle>
                <CardDescription>Estimate your savings from automated workflows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Avg. Hourly Rate ($)</Label>
                        <Input
                            type="number"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(Number(e.target.value))}
                            className="h-10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Hours Saved / Month</Label>
                        <Input
                            type="number"
                            value={hoursSaved}
                            onChange={(e) => setHoursSaved(Number(e.target.value))}
                            className="h-10"
                        />
                    </div>
                </div>

                <div className="pt-6 border-t">
                    <div className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">Estimated Monthly Savings</div>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-extrabold text-slate-900">${totalSavings.toLocaleString()}</span>
                        <Badge className="mb-1.5 bg-green-100 text-green-700 hover:bg-green-100 border-0">
                            + 15% from last month
                        </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                        Based on current execution data and your custom labor cost inputs.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
