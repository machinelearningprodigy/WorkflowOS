"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Key, Copy, Trash2, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const keys = [
    { name: "Production API", key: "pk_live_******************", created: "Oct 12, 2024", lastUsed: "2 mins ago" },
    { name: "Development Staging", key: "pk_test_******************", created: "Sep 28, 2024", lastUsed: "1 day ago" },
]

export function APIKeyList() {
    return (
        <div className="space-y-4">
            {keys.map((key) => (
                <Card key={key.name} className="border-slate-200 hover:border-indigo-100 transition-colors group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                    <Key className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-slate-900 truncate">{key.name}</h4>
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-[10px] font-black uppercase h-4 px-1.5">Active</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="text-sm font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                            {key.key}
                                        </code>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-indigo-600">
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Used</div>
                                <div className="text-sm font-semibold text-slate-700">{key.lastUsed}</div>
                            </div>

                            <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
