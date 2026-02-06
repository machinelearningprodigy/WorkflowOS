"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Search,
    Send,
    MessageSquare,
    Database,
    Zap,
    Globe,
    Plus,
    ArrowRight,
    Filter
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const ACTIONS = [
    { id: 'send-email', name: 'Send Email', category: 'Communication', icon: Send, provider: 'Gmail', description: 'Send an email to one or more recipients' },
    { id: 'slack-msg', name: 'Post to Slack', category: 'Communication', icon: MessageSquare, provider: 'Slack', description: 'Send a message to a channel or user' },
    { id: 'ai-prompt', name: 'AI Text Gen', category: 'AI', icon: Zap, provider: 'HuggingFace', description: 'Generate content using high-end LLMs' },
    { id: 'ai-summary', name: 'Summarize', category: 'AI', icon: Zap, provider: 'HuggingFace', description: 'Summarize long texts or documents' },
    { id: 'db-query', name: 'Query Database', category: 'Storage', icon: Database, provider: 'PostgreSQL', description: 'Fetch records from your database' },
    { id: 'http-req', name: 'HTTP Request', category: 'Developer', icon: Globe, provider: 'Custom', description: 'Call any external API endpoint' },
]

export function ActionSelector({
    onSelect
}: {
    onSelect: (action: any) => void
}) {
    const [search, setSearch] = React.useState("")
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null)

    const categories = Array.from(new Set(ACTIONS.map(a => a.category)))

    const filtered = ACTIONS.filter(a =>
        (search === "" || a.name.toLowerCase().includes(search.toLowerCase())) &&
        (activeCategory === null || a.category === activeCategory)
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search all actions (e.g. Gmail, AI, Slack)..."
                        className="pl-9 h-11"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-11 px-4 gap-2">
                    <Filter className="h-4 w-4" />
                    Integrations
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                <Badge
                    variant={activeCategory === null ? 'default' : 'secondary'}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => setActiveCategory(null)}
                >
                    All
                </Badge>
                {categories.map(cat => (
                    <Badge
                        key={cat}
                        variant={activeCategory === cat ? 'default' : 'secondary'}
                        className="cursor-pointer px-3 py-1"
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </Badge>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((action, index) => (
                    <motion.div
                        key={action.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                    >
                        <Card
                            className="group cursor-pointer border-border/50 bg-card/50 p-4 transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
                            onClick={() => onSelect(action)}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50 text-primary">
                                    <action.icon className="h-5 w-5" />
                                </div>
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {action.provider}
                                </Badge>
                            </div>
                            <h4 className="font-bold text-sm tracking-tight mb-1">{action.name}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                                {action.description}
                            </p>
                            <div className="flex items-center text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                ADD STEP <ArrowRight className="ml-1 h-3 w-3" />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="rounded-xl border border-dashed p-8 text-center bg-muted/20">
                <p className="text-sm text-muted-foreground mb-4">Can't find what you're looking for?</p>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Request Custom Integration
                </Button>
            </div>
        </div>
    )
}

import { Button } from "@/components/ui/button"
