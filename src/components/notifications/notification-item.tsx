"use client"

import { Check, AlertCircle, Info, Zap, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NotificationItemProps {
    id: string | number
    title: string
    description: string
    type: "success" | "error" | "info" | "warning"
    time: string
    unread?: boolean
    onRead?: (id: any) => void
    onDelete?: (id: any) => void
}

export function NotificationItem({
    id,
    title,
    description,
    type,
    time,
    unread,
    onRead,
    onDelete
}: NotificationItemProps) {
    const Icon = type === 'success' ? Check :
        type === 'error' ? AlertCircle :
            type === 'warning' ? AlertCircle : Info

    const typeColors = {
        success: "bg-green-100 text-green-600",
        error: "bg-red-100 text-red-600",
        warning: "bg-amber-100 text-amber-600",
        info: "bg-blue-100 text-blue-600"
    }

    return (
        <div
            className={cn(
                "group relative flex gap-4 p-4 rounded-2xl transition-all hover:bg-slate-50 border border-transparent",
                unread ? "bg-indigo-50/30 border-indigo-50" : ""
            )}
            onClick={() => onRead?.(id)}
        >
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", typeColors[type])}>
                <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-sm text-slate-900 truncate">{title}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{time}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {description}
                </p>
                {unread && (
                    <div className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-600" />
                )}
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.(id)
                }}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </div>
    )
}
