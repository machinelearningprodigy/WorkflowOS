"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    Filter,
    Grid3X3,
    List as ListIcon,
    Globe,
    Mail,
    Database,
    Calendar,
    MessageSquare,
    Zap,
    LayoutGrid
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IntegrationCard, Integration } from "./integration-card"

const MOCK_INTEGRATIONS: Integration[] = [
    { id: '1', name: 'Gmail', icon: Mail, status: 'connected', description: 'Connect your Gmail account to send and receive emails.', category: 'Communication', lastSync: '2m ago' },
    { id: '2', name: 'Google Calendar', icon: Calendar, status: 'connected', description: 'Sync your events and manage your schedule.', category: 'Productivity', lastSync: '1h ago' },
    { id: '3', name: 'Slack', icon: MessageSquare, status: 'disconnected', description: 'Send messages and notifications to your Slack channels.', category: 'Communication' },
    { id: '4', name: 'PostgreSQL', icon: Database, status: 'error', description: 'Query and sync data from your Postgres database.', category: 'Storage', lastSync: 'Failed' },
    { id: '5', name: 'Stripe', icon: Globe, status: 'disconnected', description: 'Process payments and manage customer subscriptions.', category: 'Finance' },
    { id: '6', name: 'OpenAI', icon: Zap, status: 'connected', description: 'Generate text, summaries, and more using GPT models.', category: 'AI', lastSync: 'Just now' },
]

export function IntegrationBrowser() {
    const [search, setSearch] = React.useState("")
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null)

    const categories = ["All", "Communication", "Productivity", "Storage", "Finance", "AI"]

    const filtered = MOCK_INTEGRATIONS.filter(i =>
        (search === "" || i.name.toLowerCase().includes(search.toLowerCase())) &&
        (activeCategory === null || activeCategory === "All" || i.category === activeCategory)
    )

    return (
        <div className="space-y-8 pb-12">
            <div className="relative overflow-hidden rounded-3xl bg-primary/5 border border-primary/10 p-12 text-center shadow-inner">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 space-y-4"
                >
                    <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1">
                        Hub
                    </Badge>
                    <h1 className="text-4xl font-black tracking-tight text-foreground dark:text-white sm:text-5xl">
                        Browse <span className="text-primary italic">Integrations</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-muted-foreground text-sm font-medium leading-relaxed">
                        Connect your favorite tools and build powerful cross-app automations in seconds.
                        We support over 200+ integrations natively.
                    </p>
                </motion.div>
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, category, or functionality..."
                        className="pl-9 h-11 rounded-xl bg-card border-border/50 shadow-sm transition-all focus:border-primary/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {categories.map(cat => (
                        <Badge
                            key={cat}
                            variant={activeCategory === cat || (cat === "All" && activeCategory === null) ? 'default' : 'outline'}
                            className={cn(
                                "cursor-pointer px-4 py-1.5 rounded-full transition-all border-border/50 hover:bg-primary/10 hover:text-primary",
                                (activeCategory === cat || (cat === "All" && activeCategory === null)) && "shadow-lg shadow-primary/20"
                            )}
                            onClick={() => setActiveCategory(cat === "All" ? null : cat)}
                        >
                            {cat === "All" && <LayoutGrid className="h-3 w-3 mr-1.5" />}
                            {cat}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                <AnimatePresence mode="popLayout">
                    {filtered.map((integration, index) => (
                        <IntegrationCard
                            key={integration.id}
                            integration={integration}
                            onConnect={() => { }}
                            onDisconnect={() => { }}
                            onSettings={() => { }}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground animate-bounce mb-6">
                        <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No integrations found</h3>
                    <p className="text-muted-foreground max-w-xs text-sm">
                        We couldn't find any results for "{search}". Try searching for something else or request a custom integration.
                    </p>
                    <Button variant="outline" className="mt-8 rounded-xl gap-2">
                        Request Custom App
                    </Button>
                </div>
            )}
        </div>
    )
}
