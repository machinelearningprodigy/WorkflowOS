"use client"

import { useState } from "react"
import { Bell, Check, Zap, AlertCircle, Info } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const notifications = [
    { id: 1, title: "Workflow Succeeded", desc: "Sync Shopify to Airtable completed successfully.", type: "success", time: "2m ago", unread: true },
    { id: 2, title: "New Team Member", desc: "Sarah Smith joined the organization.", type: "info", time: "1h ago", unread: true },
    { id: 3, title: "Execution Failed", desc: "Daily DB Backup failed due to timeout.", type: "error", time: "5h ago", unread: false },
]

export function NotificationBell() {
    const unreadCount = notifications.filter(n => n.unread).length

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-slate-100">
                    <Bell className="h-5 w-5 text-slate-500" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[380px] p-0 rounded-[2rem] border-0 shadow-2xl shadow-slate-200">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50 rounded-t-[2rem]">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-black text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <Badge className="bg-indigo-600 text-white border-0 font-black text-[10px] h-5">{unreadCount} New</Badge>
                        )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Stay updated with your automations.</p>
                </div>

                <ScrollArea className="h-[400px]">
                    <div className="p-2 space-y-1">
                        {notifications.map((n) => (
                            <button key={n.id} className={`w-full text-left p-4 rounded-2xl transition-all hover:bg-slate-50 flex gap-4 ${n.unread ? 'bg-indigo-50/30' : ''}`}>
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'success' ? 'bg-green-100 text-green-600' :
                                        n.type === 'error' ? 'bg-red-100 text-red-600' :
                                            'bg-blue-100 text-blue-600'
                                    }`}>
                                    {n.type === 'success' ? <Check className="h-5 w-5" /> :
                                        n.type === 'error' ? <AlertCircle className="h-5 w-5" /> :
                                            <Info className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className="font-bold text-sm text-slate-900 truncate">{n.title}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{n.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center rounded-b-[2rem]">
                    <Button variant="link" className="text-xs font-black text-indigo-600 hover:no-underline">
                        View All Notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
