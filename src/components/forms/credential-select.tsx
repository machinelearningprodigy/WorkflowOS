"use client"

import { useState } from "react"
import { Plus, Key, Check } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Credential {
    id: string
    name: string
    provider: string
}

interface CredentialSelectProps {
    provider: string
    value?: string
    onSelect: (id: string) => void
    onCreateNew: () => void
}

const mockCredentials: Credential[] = [
    { id: "cred_1", name: "Personal Gmail", provider: "gmail" },
    { id: "cred_2", name: "Marketing Slack", provider: "slack" },
    { id: "cred_3", name: "Main Airtable Key", provider: "airtable" },
]

export function CredentialSelect({
    provider,
    value,
    onSelect,
    onCreateNew
}: CredentialSelectProps) {
    const creds = mockCredentials.filter(c => c.provider === provider)

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Authentication</span>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    onClick={onCreateNew}
                >
                    <Plus className="h-3 w-3 mr-1" /> Add New
                </Button>
            </div>

            <Select value={value} onValueChange={onSelect}>
                <SelectTrigger className="h-12 border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center">
                            <Key className="h-3 w-3 text-slate-500" />
                        </div>
                        <SelectValue placeholder="Select credentials..." />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {creds.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-500">
                            No credentials found.
                        </div>
                    ) : (
                        creds.map((cred) => (
                            <SelectItem key={cred.id} value={cred.id}>
                                {cred.name}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
        </div>
    )
}
