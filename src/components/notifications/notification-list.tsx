"use client"

import { NotificationItem } from "./notification-item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { CheckCheck } from "lucide-react"

const mockNotifications = [
    { id: 1, title: "Workflow Succeeded", description: "Sync Shopify to Airtable completed successfully.", type: "success" as const, time: "2m ago", unread: true },
    { id: 2, title: "New Team Member", description: "Sarah Smith joined the organization.", type: "info" as const, time: "1h ago", unread: true },
    { id: 3, title: "Execution Failed", description: "Daily DB Backup failed due to timeout.", type: "error" as const, time: "5h ago", unread: false },
    { id: 4, title: "Limits Approaching", description: "You have used 80% of your monthly execution limit.", type: "warning" as const, time: "1d ago", unread: false },
]

export function NotificationList() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                    <CheckCheck className="h-3 w-3 mr-1" /> Mark all as read
                </Button>
            </div>

            <div className="space-y-2">
                {mockNotifications.map((n) => (
                    <NotificationItem
                        key={n.id}
                        {...n}
                        onRead={(id) => console.log("Read", id)}
                        onDelete={(id) => console.log("Delete", id)}
                    />
                ))}
            </div>
        </div>
    )
}
