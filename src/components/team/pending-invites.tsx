"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Link as LinkIcon, Mail } from "lucide-react"

const invites = [
    { email: "dev@external.com", role: "Developer", date: "2 days ago" },
    { email: "admin@partner.io", role: "Admin", date: "5 hours ago" },
]

export function PendingInvites() {
    return (
        <Card className="border-slate-200">
            <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>Sent invitations that haven't been accepted yet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {invites.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm italic">
                        No pending invites.
                    </div>
                ) : (
                    invites.map((invite) => (
                        <div key={invite.email} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{invite.email}</div>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        {invite.role} • Sent {invite.date}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-white text-xs font-bold">
                                    <LinkIcon className="h-3 w-3 mr-1" /> Copy Link
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
