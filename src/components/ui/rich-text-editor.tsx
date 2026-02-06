"use client"

import * as React from "react"
import { useEffect, useRef } from "react"
import { Bold, Italic, List, ListOrdered } from "lucide-react"
import { cn } from "@/lib/utils"

export function RichTextEditor({
    value,
    onChange,
    className,
}: {
    value: string
    onChange: (val: string) => void
    className?: string
}) {
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value
        }
    }, [value])

    const execCommand = (command: string) => {
        document.execCommand(command, false)
        if (editorRef.current) onChange(editorRef.current.innerHTML)
    }

    return (
        <div className={cn("rounded-md border bg-background", className)}>
            <div className="flex items-center gap-1 border-b p-1">
                <button onClick={() => execCommand('bold')} className="p-1.5 hover:bg-muted rounded">
                    <Bold className="h-4 w-4" />
                </button>
                <button onClick={() => execCommand('italic')} className="p-1.5 hover:bg-muted rounded">
                    <Italic className="h-4 w-4" />
                </button>
                <div className="w-px h-4 bg-border mx-1" />
                <button onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-muted rounded">
                    <List className="h-4 w-4" />
                </button>
                <button onClick={() => execCommand('insertOrderedList')} className="p-1.5 hover:bg-muted rounded">
                    <ListOrdered className="h-4 w-4" />
                </button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={(e) => onChange(e.currentTarget.innerHTML)}
                className="min-h-[150px] p-4 outline-none prose prose-sm dark:prose-invert max-w-none"
                onBlur={(e) => onChange(e.currentTarget.innerHTML)}
            />
        </div>
    )
}
