import { motion } from "framer-motion"
import { AlertCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ErrorState({
    title = "Something went wrong",
    description = "We couldn't load the data. Please try again.",
    onRetry,
    className,
}: {
    title?: string
    description?: string
    onRetry?: () => void
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
            >
                <div className="mb-4 rounded-full bg-destructive/10 p-4">
                    <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-muted-foreground max-w-[300px] mb-6">
                    {description}
                </p>
                {onRetry && (
                    <Button variant="outline" onClick={onRetry} className="gap-2">
                        <RefreshCcw className="h-4 w-4" />
                        Try Again
                    </Button>
                )}
            </motion.div>
        </div>
    )
}
