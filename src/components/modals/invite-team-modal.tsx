"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Mail, Shield } from "lucide-react"
import { RoleSelector } from "../team/role-selector"

interface InviteTeamModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function InviteTeamModal({ isOpen, onOpenChange }: InviteTeamModalProps) {
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("admin")

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-0">
                <DialogHeader className="p-4 pt-8 text-center">
                    <div className="h-16 w-16 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6 mx-auto">
                        <UserPlus className="h-8 w-8 text-indigo-600" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-slate-900 mb-2">Invite Team Member</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">
                        Expand your organization and collaborate on automations.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 space-y-6">
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="colleague@company.com"
                                className="h-12 pl-12 border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-indigo-50 transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Assign Role</Label>
                        <RoleSelector value={role} onChange={setRole} />
                    </div>
                </div>

                <DialogFooter className="p-4 pt-0">
                    <Button
                        disabled={!email}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl text-sm font-black shadow-xl shadow-indigo-100 gap-2"
                        onClick={() => onOpenChange(false)}
                    >
                        Send Invitation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
