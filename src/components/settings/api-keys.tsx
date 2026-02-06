"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Plus, Key, Copy, Check, Trash2, Eye, EyeOff, ShieldCheck, AlertCircle, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-hot-toast" // Changed to react-hot-toast which is in package.json
import { cn } from "@/lib/utils"

export interface APIKey {
    id: string
    name: string
    key: string
    lastUsed: string
    createdAt: string
    permissions: 'full' | 'read' | 'write'
}

export function APIKeys({
    keys = [],
    onGenerate,
    onRevoke
}: {
    keys?: APIKey[]
    onGenerate: (name: string) => void
    onRevoke: (id: string) => void
}) {
    const [showKey, setShowKey] = React.useState<Record<string, boolean>>({})
    const [copiedId, setCopiedId] = React.useState<string | null>(null)

    const toggleKey = (id: string) => {
        setShowKey(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const copyKey = (id: string, key: string) => {
        navigator.clipboard.writeText(key)
        setCopiedId(id)
        toast.success("API Key copied")
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight">Access Tokens</h2>
                    <p className="text-sm text-muted-foreground">Manage secret keys used to authenticate with the WorkflowOS API.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => onGenerate("Personal Key")}>
                    <Plus className="h-4 w-4" />
                    Generate New Key
                </Button>
            </div>

            <div className="rounded-2xl border bg-card/50 overflow-hidden backdrop-blur-sm shadow-xl shadow-primary/5">
                <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Key className="h-3.5 w-3.5" />
                        Active Secret Keys
                    </div>
                    <Badge variant="outline" className="text-[9px] font-bold bg-muted/50 border-border/50">PROTECTED</Badge>
                </div>

                <div className="divide-y divide-border/50">
                    {keys.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 group hover:bg-muted/10 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1.5 flex-1 max-w-md">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-sm tracking-tight">{item.name}</h4>
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "text-[9px] uppercase font-black tracking-widest px-2 h-4",
                                                item.permissions === 'full' ? "bg-primary/5 text-primary border-primary/20" : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {item.permissions} access
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 relative">
                                        <div className="flex-1 font-mono text-xs bg-zinc-950 p-2.5 rounded-lg border border-border/50 text-zinc-400 overflow-hidden pr-24">
                                            {showKey[item.id] ? item.key : "••••••••••••••••••••••••••••••••"}
                                        </div>
                                        <div className="absolute right-2 flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white" onClick={() => toggleKey(item.id)}>
                                                {showKey[item.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white" onClick={() => copyKey(item.id, item.key)}>
                                                {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12">
                                    <div className="hidden lg:flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                            <Terminal className="h-3 w-3" /> Last Active
                                        </span>
                                        <span className="text-xs font-medium">{item.lastUsed}</span>
                                    </div>
                                    <div className="hidden lg:flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                            <ShieldCheck className="h-3 w-3" /> Created
                                        </span>
                                        <span className="text-xs font-medium">{item.createdAt}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100" onClick={() => onRevoke(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {keys.length === 0 && (
                        <div className="p-16 text-center bg-muted/5 flex flex-col items-center justify-center space-y-4">
                            <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground animate-pulse">
                                <Key className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold">No API keys found</h3>
                                <p className="text-xs text-muted-foreground max-w-[240px]">You haven't generated any access tokens for your account yet.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-blue-800 dark:bg-blue-500/5 dark:border-blue-500/10 dark:text-blue-200">
                <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                    <h4 className="font-bold text-sm tracking-tight italic uppercase">Security Best Practices</h4>
                    <p className="text-xs leading-relaxed opacity-80">
                        Your API keys carry the same weight as your login password. Never share them publicly or commit them to version control.
                        Rotate your keys every 90 days for maximum security.
                    </p>
                </div>
            </div>
        </div>
    )
}
