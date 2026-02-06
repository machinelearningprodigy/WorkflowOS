import * as React from "react"
import { cn } from "@/lib/utils"

export function Timeline({
    items,
    className,
}: {
    items: {
        title: string
        description?: string
        timestamp: string
        status?: "success" | "error" | "pending"
    }[]
    className?: string
}) {
    return (
        <div className={cn("space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent", className)}>
            {items.map((item, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <div className={cn(
                            "w-3 h-3 rounded-full",
                            item.status === 'success' ? 'bg-emerald-500' :
                                item.status === 'error' ? 'bg-rose-500' : 'bg-current'
                        )} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-4 rounded border shadow-sm">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-card-foreground">{item.title}</div>
                            <time className="font-mono text-xs text-muted-foreground">{item.timestamp}</time>
                        </div>
                        {item.description && (
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
