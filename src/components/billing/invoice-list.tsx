"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

const invoices = [
    { id: "INV-001", date: "Oct 1, 2024", amount: "$49.00", status: "Paid" },
    { id: "INV-002", date: "Sep 1, 2024", amount: "$49.00", status: "Paid" },
    { id: "INV-003", date: "Aug 1, 2024", amount: "$49.00", status: "Paid" },
]

export function InvoiceList() {
    return (
        <Card className="border-slate-200">
            <CardHeader>
                <CardTitle>Invoice History</CardTitle>
                <CardDescription>View and download your past billing statements.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[120px]">Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id} className="group">
                                <TableCell className="font-semibold text-slate-700">{invoice.date}</TableCell>
                                <TableCell className="text-slate-900 font-bold">{invoice.amount}</TableCell>
                                <TableCell>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                        {invoice.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8 text-slate-400 group-hover:text-indigo-600">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
