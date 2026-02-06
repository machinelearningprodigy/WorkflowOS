'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, CreditCard, Receipt, Zap } from "lucide-react"

export default function BillingPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Billing & Settings</h2>
                <p className="text-muted-foreground">
                    Manage your subscription and billing information.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Current Plan */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>You are currently on the <span className="font-bold text-indigo-500">Pro Plan</span></CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Tasks used</span>
                                <span className="font-medium">12,482 / 50,000</span>
                            </div>
                            <Progress value={25} className="h-2" />
                            <p className="text-xs text-muted-foreground">Your plan resets in 12 days.</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 border rounded-lg space-y-1">
                                <div className="text-sm font-medium text-muted-foreground">Next billing date</div>
                                <div className="font-semibold">March 1st, 2026</div>
                            </div>
                            <div className="p-4 border rounded-lg space-y-1">
                                <div className="text-sm font-medium text-muted-foreground">Monthly cost</div>
                                <div className="font-semibold">$49.00</div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/50 p-6">
                        <Button variant="outline">Downgrade</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">Change Plan</Button>
                    </CardFooter>
                </Card>

                {/* Payment Method */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Manage your card details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="h-10 w-12 bg-muted rounded flex items-center justify-center">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium">Visa ending in 4242</div>
                                <div className="text-xs text-muted-foreground">Expires 12/28</div>
                            </div>
                            <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">Add Payment Method</Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Invoices */}
            <Card>
                <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>Download your previous invoices</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase border-b">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Invoce ID</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium">Amount</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { id: "INV-001", date: "Feb 1, 2026", amount: "$49.00", status: "Paid" },
                                    { id: "INV-002", date: "Jan 1, 2026", amount: "$49.00", status: "Paid" },
                                    { id: "INV-003", date: "Dec 1, 2025", amount: "$49.00", status: "Paid" },
                                ].map((inv) => (
                                    <tr key={inv.id} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-4 font-medium">{inv.id}</td>
                                        <td className="px-4 py-4">{inv.date}</td>
                                        <td className="px-4 py-4">{inv.amount}</td>
                                        <td className="px-4 py-4">
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                {inv.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <Button variant="ghost" size="sm">
                                                <Receipt className="h-4 w-4 mr-2" />
                                                PDF
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
