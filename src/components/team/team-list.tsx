"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Shield, User, Mail } from "lucide-react"

const members = [
    { name: "John Doe", email: "john@acme.com", role: "Owner", avatar: "JD", status: "Active" },
    { name: "Sarah Smith", email: "sarah@acme.com", role: "Admin", avatar: "SS", status: "Active" },
    { name: "Mike Johnson", email: "mike@acme.com", role: "Developer", avatar: "MJ", status: "Away" },
]

export function TeamList() {
    return (
        <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage your team and their access levels.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                {members.map((member) => (
                    <div key={member.email} className="flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold text-xs ring-1 ring-indigo-100">
                                    {member.avatar}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900">{member.name}</span>
                                    {member.status === 'Away' && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                    <Mail className="h-3 w-3" /> {member.email}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                {member.role === 'Owner' || member.role === 'Admin' ? (
                                    <Shield className="h-3 w-3 text-indigo-600" />
                                ) : (
                                    <User className="h-3 w-3 text-slate-400" />
                                )}
                                <span className="text-sm font-bold text-slate-700">{member.role}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="text-slate-400 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
