"use client"

import { useState } from "react"
import { Variable, Code, ChevronRight, Wand2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DynamicFieldProps {
    value: string
    onChange: (val: string) => void
    label: string
    placeholder?: string
}

export function DynamicField({ value, onChange, label, placeholder }: DynamicFieldProps) {
    const [isAIOpen, setIsAIOpen] = useState(false)

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between group">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {label}
                </label>
            </div>

            <div className="relative">
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="h-11 pr-24 border-slate-200 focus:border-indigo-500 focus:ring-indigo-50/50 transition-all font-medium"
                />

                <div className="absolute right-1 top-1 flex items-center gap-1">
                    <Popover open={isAIOpen} onOpenChange={setIsAIOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                                <Variable className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-64 p-2 rounded-2xl border-slate-200">
                            <div className="p-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-b mb-1">Insert Variable</div>
                            <div className="space-y-1">
                                {["Step 1 Output", "Trigger Payload", "User Email", "Status Code"].map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => {
                                            onChange(value + ` {{${v}}}`)
                                            setIsAIOpen(false)
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 flex items-center justify-between group"
                                    >
                                        {v}
                                        <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-slate-500" />
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-pink-600 hover:bg-pink-50">
                        <Code className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
