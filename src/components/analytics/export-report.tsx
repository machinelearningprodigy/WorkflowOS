"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Download, FileText, Table as TableIcon, Mail } from "lucide-react"

export function ExportReport() {
    return (
        <Card className="border-slate-200">
            <CardHeader>
                <CardTitle>Export Analytics</CardTitle>
                <CardDescription>Download your performance data in various formats.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl text-slate-700 hover:bg-slate-50">
                    <TableIcon className="h-5 w-5 text-green-600" />
                    Export as CSV (.csv)
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl text-slate-700 hover:bg-slate-50">
                    <FileText className="h-5 w-5 text-red-600" />
                    Export as PDF (.pdf)
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl text-slate-700 hover:bg-slate-50">
                    <Download className="h-5 w-5 text-indigo-600" />
                    Raw Workflow Logs (JSON)
                </Button>

                <div className="pt-4 border-t">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 h-12 rounded-xl">
                        <Mail className="h-4 w-4" />
                        Email Weekly Report
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
