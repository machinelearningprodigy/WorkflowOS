"use client"

import * as React from "react"
import { Share2, Link2, Globe, Lock, Copy, Check, Users, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export function WorkflowShare({
    workflowId,
    isPublic = false,
    onTogglePublic
}: {
    workflowId: string
    isPublic?: boolean
    onTogglePublic: (val: boolean) => void
}) {
    const [copied, setCopied] = React.useState(false)
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${workflowId}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        toast.success("Link copied to clipboard")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2 shadow-sm">
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 overflow-hidden border-2 shadow-2xl" align="end">
                <div className="p-4 border-b bg-muted/20">
                    <h3 className="font-bold text-sm tracking-tight uppercase">Share Workflow</h3>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Invite teammates or share with the community.</p>
                </div>

                <div className="p-4 space-y-6">
                    <div className="space-y-3">
                        <Label className="uppercase tracking-widest text-[9px] font-bold text-muted-foreground flex items-center justify-between">
                            Access Control
                            {isPublic ? (
                                <Badge variant="outline" className="h-4 text-[8px] border-emerald-500/20 text-emerald-500 bg-emerald-500/5">PUBLIC</Badge>
                            ) : (
                                <Badge variant="outline" className="h-4 text-[8px] border-amber-500/20 text-amber-500 bg-amber-500/5">PRIVATE</Badge>
                            )}
                        </Label>
                        <div
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer",
                                isPublic ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/20"
                            )}
                            onClick={() => onTogglePublic(!isPublic)}
                        >
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                isPublic ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                            )}>
                                {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold leading-none">{isPublic ? 'Publicly accessible' : 'Restricted access'}</p>
                                <p className="text-[10px] text-muted-foreground mt-1 leading-none">{isPublic ? 'Anyone with the link can view' : 'Only your team can see this'}</p>
                            </div>
                        </div>
                    </div>

                    {isPublic && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                        >
                            <Label className="uppercase tracking-widest text-[9px] font-bold text-muted-foreground">Share URL</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Link2 className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/50" />
                                    <Input
                                        value={shareUrl}
                                        readOnly
                                        className="h-9 pl-7 text-[10px] font-mono bg-muted/40"
                                    />
                                </div>
                                <Button size="icon" className="h-9 w-9 shrink-0" onClick={copyToClipboard}>
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    <div className="space-y-3 pt-4 border-t border-dashed">
                        <div className="flex items-center justify-between">
                            <Label className="uppercase tracking-widest text-[9px] font-bold text-muted-foreground">Team Permissions</Label>
                            <Button variant="ghost" className="h-6 text-[9px] gap-1 px-1">
                                <Users className="h-3 w-3" /> Manage Team
                            </Button>
                        </div>
                        <div className="flex -space-x-2 overflow-hidden py-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[10px] font-bold">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                            <div className="inline-flex h-6 w-6 rounded-full ring-2 ring-background bg-primary/10 items-center justify-center text-primary text-[8px] font-bold">
                                +4
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-muted/30 flex items-center gap-2 border-t">
                    <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">SECURED BY WORKFLOWOS IDENTITY</p>
                </div>
            </PopoverContent>
        </Popover>
    )
}

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { toast as sonnerToast } from "sonner"
