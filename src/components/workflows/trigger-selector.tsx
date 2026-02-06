"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Zap,
    Globe,
    Calendar,
    Mail,
    Database,
    Search,
    CheckCircle2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const TRIGGERS = [
    {
        id: 'webhook',
        name: 'Webhook',
        description: 'Trigger via HTTP POST request',
        icon: Globe,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        id: 'schedule',
        name: 'Schedule',
        description: 'Run on a specific interval (CRON)',
        icon: Calendar,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    },
    {
        id: 'email',
        name: 'Email Received',
        description: 'Trigger when a new email arrives',
        icon: Mail,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
    },
    {
        id: 'form',
        name: 'Form Submission',
        description: 'Trigger when a WorkflowOS form is filled',
        icon: Database,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    },
    {
        id: 'manual',
        name: 'Manual Run',
        description: 'Trigger manually via UI or API',
        icon: Zap,
        color: 'text-slate-500',
        bg: 'bg-slate-500/10'
    }
]

export function TriggerSelector({
    selectedId,
    onSelect
}: {
    selectedId?: string
    onSelect: (id: string) => void
}) {
    const [search, setSearch] = React.useState("")

    const filtered = TRIGGERS.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search triggers..."
                    className="pl-9 h-11"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((trigger, index) => (
                    <motion.div
                        key={trigger.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card
                            className={cn(
                                "group relative cursor-pointer border-2 p-5 transition-all hover:border-primary/50 hover:shadow-lg",
                                selectedId === trigger.id ? "border-primary bg-primary/5" : "border-border/50 bg-card/50"
                            )}
                            onClick={() => onSelect(trigger.id)}
                        >
                            <div className="flex items-start gap-4">
                                <div className={cn("rounded-xl p-3 shrink-0", trigger.bg)}>
                                    <trigger.icon className={cn("h-6 w-6", trigger.color)} />
                                </div>
                                <div className="flex-1 pr-6">
                                    <h4 className="font-bold text-sm tracking-tight">{trigger.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {trigger.description}
                                    </p>
                                </div>
                            </div>
                            {selectedId === trigger.id && (
                                <div className="absolute top-4 right-4 text-primary">
                                    <CheckCircle2 className="h-5 w-5 fill-current" />
                                </div>
                            )}
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
