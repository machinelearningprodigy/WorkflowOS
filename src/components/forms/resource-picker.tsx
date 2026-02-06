"use client"

import { Search, Loader2, Check, ChevronRight, File, Folder } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface Resource {
    id: string
    name: string
    type: "file" | "folder"
}

interface ResourcePickerProps {
    label: string
    value?: string
    onSelect: (id: string, name: string) => void
    provider: string
}

export function ResourcePicker({ label, value, onSelect, provider }: ResourcePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")

    const mockResources: Resource[] = [
        { id: "r_1", name: "Project Documents", type: "folder" },
        { id: "r_2", name: "Client List.xlsx", type: "file" },
        { id: "r_3", name: "Invoices 2024", type: "folder" },
        { id: "r_4", name: "Workflow Template.json", type: "file" },
    ]

    return (
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {label}
            </label>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-11 justify-between border-slate-200 hover:bg-slate-50">
                        <span className="font-medium text-slate-600 truncate">
                            {value || "Select resource..."}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle>Select {label}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search resources..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 h-11 border-slate-200"
                            />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-1 scrollbar-hide">
                            {mockResources.map((res) => (
                                <button
                                    key={res.id}
                                    onClick={() => {
                                        onSelect(res.id, res.name)
                                        setIsOpen(false)
                                    }}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 group transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white">
                                            {res.type === 'folder' ? <Folder className="h-4 w-4 text-amber-500" /> : <File className="h-4 w-4 text-blue-500" />}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{res.name}</span>
                                    </div>
                                    <Check className={`h-4 w-4 text-indigo-600 opacity-0 ${value === res.name ? 'opacity-100' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
