"use client"

import * as React from "react"
import { Search, Zap, Send, MessageSquare, Database, Globe, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const NODE_TYPES = [
    {
        category: "Triggers",
        items: [
            { id: "webhook", label: "Webhook", icon: Globe, type: "trigger", description: "Trigger via HTTP request" },
            { id: "schedule", label: "Schedule", icon: Calendar, type: "trigger", description: "Run at specific times" },
            { id: "form", label: "Form", icon: Database, type: "trigger", description: "On form submission" },
        ],
    },
    {
        category: "AI Actions",
        items: [
            { id: "ai-prompt", label: "AI Prompt", icon: MessageSquare, type: "action", description: "Generate text using LLM" },
            { id: "ai-extract", label: "Extract Data", icon: Zap, type: "action", description: "Extract structured data" },
        ],
    },
    {
        category: "Integrations",
        items: [
            { id: "email", label: "Send Email", icon: Send, type: "action", description: "Send via Gmail/Resend" },
            { id: "slack", label: "Slack Message", icon: Send, type: "action", description: "Post to Slack channel" },
        ],
    },
]

export function NodeSidebar() {
    const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
        event.dataTransfer.setData("application/reactflow", nodeType)
        event.dataTransfer.setData("application/nodeData", JSON.stringify(data))
        event.dataTransfer.effectAllowed = "move"
    }

    return (
        <div className="flex h-full w-80 flex-col border-r bg-card/50 backdrop-blur-sm">
            <div className="p-4 border-b">
                <h3 className="font-bold mb-4">Components</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search components..." className="pl-9 h-9" />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-8">
                    {NODE_TYPES.map((section) => (
                        <div key={section.category}>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                                {section.category}
                            </h4>
                            <div className="grid gap-3">
                                {section.items.map((item) => (
                                    <div
                                        key={item.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, "custom", item)}
                                        className="group flex cursor-grab items-center gap-3 rounded-lg border bg-background p-3 transition-all hover:border-primary hover:shadow-md active:cursor-grabbing"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted/50 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-semibold">{item.label}</p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
