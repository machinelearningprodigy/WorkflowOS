"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, MoreVertical, ShieldCheck, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function PaymentMethod() {
    return (
        <Card className="border-slate-200">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>How you're paying for your subscription.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 bg-slate-50/30">
                    <div className="h-12 w-16 bg-white border rounded-lg flex items-center justify-center shadow-sm">
                        <span className="font-black italic text-indigo-700 text-lg">VISA</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">Visa ending in 4242</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-[10px] h-4">DEFAULT</Badge>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Expires 12/2026</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-200">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <div className="text-xs text-slate-500">
                            Billing email: <span className="font-bold text-slate-700">billing@acme.inc</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-200">
                        <ShieldCheck className="h-4 w-4 text-slate-400" />
                        <div className="text-xs text-slate-500">
                            Securely handled by <span className="font-bold text-indigo-600">Stripe</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-0 p-6 flex justify-end">
                <Button variant="link" className="text-indigo-600 font-bold hover:no-underline px-0">Edit Payment Details</Button>
            </CardFooter>
        </Card>
    )
}
