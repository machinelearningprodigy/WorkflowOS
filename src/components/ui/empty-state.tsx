import { motion } from "framer-motion"
import { Inbox, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
    icon: Icon = Inbox,
    className,
}: {
    title: string
    description: string
    actionLabel?: string
    onAction?: () => void
    icon?: any
    className?: string
}) {
    return (
        <div
            className={cn(
                "flex min-h-[400px] flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-xl",
                className
            )}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
            >
                <div className="mb-4 rounded-full bg-muted p-4">
                    <Icon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-muted-foreground max-w-[300px] mb-6">
                    {description}
                </p>
                {actionLabel && onAction && (
                    <Button onClick={onAction} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {actionLabel}
                    </Button>
                )}
            </motion.div>
        </div>
    )
}
