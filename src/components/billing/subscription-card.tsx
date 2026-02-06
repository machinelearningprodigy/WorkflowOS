"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, ArrowRight } from "lucide-react"

export function SubscriptionCard() {
    return (
        <Card className="border-slate-200 overflow-hidden">
            <div className="h-2 bg-indigo-600 w-full" />
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Pro Plan</CardTitle>
                        <CardDescription>Advanced automation for growing teams.</CardDescription>
                    </div>
                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 uppercase tracking-wider font-bold h-6">Active</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">$49</span>
                    <span className="text-slate-400 font-medium">/month</span>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <Check className="h-4 w-4 text-green-600" /> 10,000 executions / month
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <Check className="h-4 w-4 text-green-600" /> Unlimited workflows
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <Check className="h-4 w-4 text-green-600" /> Priority support (24h)
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <Check className="h-4 w-4 text-green-600" /> Advanced analytics
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t flex gap-3 p-6">
                <Button variant="outline" className="flex-1 rounded-xl">Manage Plan</Button>
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl">Upgrade <ArrowRight className="h-4 w-4 ml-2" /></Button>
            </CardFooter>
        </Card>
    )
}
