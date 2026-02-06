"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CodeEditorProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    language?: string
}

const CodeEditor = React.forwardRef<HTMLTextAreaElement, CodeEditorProps>(
    ({ className, language, ...props }, ref) => {
        return (
            <div className="relative rounded-md border bg-zinc-950 font-mono text-sm leading-relaxed text-zinc-50">
                <textarea
                    ref={ref}
                    className={cn(
                        "flex min-h-[200px] w-full bg-transparent p-4 outline-none placeholder:text-zinc-500",
                        className
                    )}
                    spellCheck={false}
                    {...props}
                />
                <div className="absolute bottom-2 right-2 rounded bg-zinc-800 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400">
                    {language || "code"}
                </div>
            </div>
        )
    }
)
CodeEditor.displayName = "CodeEditor"

export { CodeEditor }
