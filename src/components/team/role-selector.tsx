"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Shield, ShieldAlert, ShieldCheck, User } from "lucide-react"

const roles = [
    { id: "owner", name: "Owner", description: "Full access to all settings and billing.", icon: ShieldAlert, color: "text-red-600" },
    { id: "admin", name: "Admin", description: "Can manage team and workflows.", icon: ShieldCheck, color: "text-indigo-600" },
    { id: "developer", name: "Developer", description: "Can create and edit workflows.", icon: Shield, color: "text-blue-600" },
    { id: "viewer", name: "Viewer", description: "ReadOnly access to executions.", icon: User, color: "text-slate-400" },
]

export function RoleSelector({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="h-12 border-slate-200">
                <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-200">
                {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id} className="p-3 focus:bg-slate-50 rounded-xl">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                                <role.icon className={`h-3 w-3 ${role.color}`} />
                                <span className="font-bold text-slate-900">{role.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium leading-tight">
                                {role.description}
                            </span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
