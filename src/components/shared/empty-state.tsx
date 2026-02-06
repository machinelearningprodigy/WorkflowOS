import { LucideIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    actionLabel?: string
    onAction?: () => void
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 animate-in fade-in zoom-in duration-500">
            <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-8 ring-8 ring-slate-50/50">
                <Icon className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed mb-8">
                {description}
            </p>
            {actionLabel && (
                <Button
                    onClick={onAction}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-8 font-black shadow-xl shadow-indigo-100 gap-2"
                >
                    <Plus className="h-4 w-4" /> {actionLabel}
                </Button>
            )}
        </div>
    )
}
