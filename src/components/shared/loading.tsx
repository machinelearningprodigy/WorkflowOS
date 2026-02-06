import { Loader2, Zap } from "lucide-react"

export function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-12">
            <div className="relative h-16 w-16 mb-6">
                <div className="absolute inset-0 rounded-2xl bg-indigo-100 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-indigo-600 animate-bounce" />
                </div>
            </div>
            <div className="space-y-2 text-center">
                <div className="flex items-center gap-2 justify-center font-black text-slate-900 text-lg uppercase tracking-tighter">
                    Workflow<span className="text-indigo-600">OS</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Loader2 className="h-3 w-3 animate-spin" /> Fetching logic...
                </div>
            </div>
        </div>
    )
}
