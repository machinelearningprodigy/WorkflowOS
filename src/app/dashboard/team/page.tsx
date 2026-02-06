'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, MoreHorizontal, Plus, Shield, UserPlus } from "lucide-react"

const members = [
    { name: "John Doe", email: "john@example.com", role: "Owner", status: "Active", avatar: "JD" },
    { name: "Sarah Smith", email: "sarah@example.com", role: "Admin", status: "Active", avatar: "SS" },
    { name: "Mike Johnson", email: "mike@example.com", role: "Developer", status: "Active", avatar: "MJ" },
    { name: "Alex Chen", email: "alex@example.com", role: "Viewer", status: "Pending", avatar: "AC" },
]

export default function TeamPage() {
    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
                    <p className="text-muted-foreground">
                        Invite and manage team members and their permissions.
                    </p>
                </div>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
                    <UserPlus className="mr-2 h-4 w-4" /> Invite Member
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">3 seats remaining</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">Expires in 7 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Admin Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Authorized to manage billing</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Members</CardTitle>
                            <CardDescription>A list of everyone in your team</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input placeholder="Filter members..." className="w-[200px]" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {members.map((member, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-medium">
                                            {member.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{member.name}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Mail className="h-3 w-3" /> {member.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-1.5 min-w-[100px]">
                                        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-sm font-medium">{member.role}</span>
                                    </div>
                                    <Badge variant={member.status === 'Active' ? 'default' : 'outline'}
                                        className={member.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-0' : ''}>
                                        {member.status}
                                    </Badge>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
