import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function LoadingState({
    title = "Loading...",
    description = "Please wait while we fetch your data.",
    className,
}: {
    title?: string
    description?: string
    className?: string
}) {
    return (
        <div
            className={cn(
                "flex min-h-[400px] flex-col items-center justify-center p-8 text-center",
                className
            )}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
            >
                <div className="relative mb-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-muted-foreground max-w-[250px]">{description}</p>
            </motion.div>
        </div>
    )
}
