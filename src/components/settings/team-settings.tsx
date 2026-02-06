"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    UserPlus,
    Trash2,
    ShieldCheck,
    Mail,
    ChevronRight,
    Search,
    MoreVertical,
    Settings2,
    Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface Member {
    id: string
    name: string
    email: string
    role: 'owner' | 'admin' | 'member' | 'viewer'
    avatar?: string
    joinedAt: string
}

export function TeamSettings({
    members = [],
    onInvite,
    onRemove,
    onUpdateRole
}: {
    members?: Member[]
    onInvite: (email: string, role: string) => void
    onRemove: (id: string) => void
    onUpdateRole: (id: string, role: string) => void
}) {
    const [search, setSearch] = React.useState("")

    const filtered = members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight">Team Members</h2>
                    <p className="text-sm text-muted-foreground">Manage your workspace by inviting people and assigning roles.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20 h-11 px-6 rounded-xl" onClick={() => onInvite("", "member")}>
                    <UserPlus className="h-4 w-4" />
                    Invite New Member
                </Button>
            </div>

            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Find member by name or email..."
                    className="pl-9 h-11 rounded-xl bg-card border-border/50 transition-all focus:border-primary/50"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="rounded-2xl border bg-card/50 overflow-hidden backdrop-blur-sm shadow-xl shadow-primary/5">
                <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Manage Workspace Roster
                    </div>
                    <Badge variant="outline" className="text-[9px] font-bold bg-muted/50 border-border/50">{members.length} Total</Badge>
                </div>

                <div className="divide-y divide-border/50">
                    {filtered.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-muted/10 transition-colors gap-6"
                        >
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-background shadow-sm group-hover:scale-105 transition-transform">
                                    <AvatarImage src={`https://avatar.vercel.sh/${member.email}`} />
                                    <AvatarFallback className="font-bold text-xs">{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-sm tracking-tight">{member.name}</h4>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-[8px] font-black uppercase tracking-widest px-1.5 h-4",
                                                member.role === 'owner' ? "bg-amber-500 text-white border-amber-600 shadow-sm" :
                                                    member.role === 'admin' ? "bg-primary/5 text-primary border-primary/20" :
                                                        "text-muted-foreground"
                                            )}
                                        >
                                            {member.role}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                                        <Mail className="h-3 w-3 opacity-50" /> {member.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                                <div className="hidden lg:flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Joined</span>
                                    <span className="text-xs font-medium">{member.joinedAt}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-bold border-border/50 bg-background/50">
                                                <Settings2 className="h-3.5 w-3.5" />
                                                Manage
                                                <ChevronRight className="h-3 w-3 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 border-2 shadow-2xl p-2">
                                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-2">Change Role</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => onUpdateRole(member.id, 'admin')} className="gap-2">
                                                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Make Admin
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onUpdateRole(member.id, 'viewer')} className="gap-2">
                                                <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Make Viewer
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="-mx-2" />
                                            <DropdownMenuItem onClick={() => onRemove(member.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive gap-2 font-bold">
                                                <Trash2 className="h-3.5 w-3.5" /> Remove from Team
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground md:hidden lg:flex">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="p-20 text-center bg-muted/5">
                            <p className="text-sm text-muted-foreground italic">No members found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-2xl bg-zinc-950 p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 space-y-4 max-w-lg">
                    <h3 className="text-xl font-black italic tracking-tight">Need granular control?</h3>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                        Upgrade to Enterprise for advanced RBAC, custom permission sets, and SAML SSO integration for your entire organization.
                    </p>
                    <Button className="bg-white text-black hover:bg-zinc-200 font-bold px-8 h-12 rounded-xl">
                        Contact Enterprise Sales
                    </Button>
                </div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                <Users className="absolute bottom-[-20px] right-[-20px] h-64 w-64 text-white/5 rotate-12 pointer-events-none" />
            </div>
        </div>
    )
}

import { DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
