"use client"

import * as React from "react"
import { User, Mail, Camera, Save, Shield, Terminal, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function ProfileSettings({
    user,
    onSave
}: {
    user: any
    onSave: (data: any) => void
}) {
    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight">Personal Profile</h2>
                    <p className="text-sm text-muted-foreground">Manage your identity and public appearance on the platform.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20 h-11 px-6 rounded-xl" onClick={() => onSave({})}>
                    <Save className="h-4 w-4" />
                    Save Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-6">
                    <div className="relative group w-fit mx-auto md:mx-0">
                        <Avatar className="h-40 w-40 ring-4 ring-primary/5 border-4 border-background shadow-2xl transition-transform group-hover:scale-105">
                            <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                            <AvatarFallback className="text-2xl font-black">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-2 right-2 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 hover:rotate-12 border-4 border-background">
                            <Camera className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/50">
                            <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                <Shield className="h-3 w-3" /> Account Status
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm">Verified Member</span>
                                <Badge className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-zinc-950 text-white shadow-xl">
                            <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                <Terminal className="h-3 w-3" /> Role Metadata
                            </div>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase tracking-widest">Global Admin</Badge>
                            <p className="text-[10px] text-zinc-500 mt-2 font-mono">UUID: {user.id || 'f12-a56-990'}</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <User className="h-3 w-3" /> Full Name
                            </Label>
                            <Input defaultValue={user.name} className="h-12 bg-muted/30 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Mail className="h-3 w-3" /> Email Address
                            </Label>
                            <Input defaultValue={user.email} className="h-12 bg-muted/30 rounded-xl" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Globe className="h-3 w-3" /> Public Bio
                        </Label>
                        <Textarea
                            placeholder="Tell us about your automation journey..."
                            className="min-h-[120px] bg-muted/30 rounded-xl resize-none p-4"
                        />
                        <p className="text-[10px] text-muted-foreground italic">Your bio will only be visible to teammates in shared workspaces.</p>
                    </div>

                    <div className="pt-8 border-t border-dashed space-y-6">
                        <h4 className="font-bold text-sm">Language & Localization</h4>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Language</Label>
                                <Input defaultValue="English (US)" readOnly className="h-11 bg-muted/20 opacity-60 cursor-not-allowed" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Timezone</Label>
                                <Input defaultValue="UTC (Coordinated Universal Time)" readOnly className="h-11 bg-muted/20 opacity-60 cursor-not-allowed" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
