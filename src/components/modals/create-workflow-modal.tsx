"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Sparkles, Wand2 } from "lucide-react"

interface CreateWorkflowModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateWorkflowModal({ isOpen, onOpenChange }: CreateWorkflowModalProps) {
    const [name, setName] = useState("")

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-0">
                <DialogHeader className="p-4 pt-8">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6 text-indigo-600" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-slate-900 leading-tight">Create New Workflow</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">Build your automation logic from scratch or use AI.</DialogDescription>
                </DialogHeader>

                <div className="p-4 space-y-6">
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Workflow Name</Label>
                        <Input
                            placeholder="e.g. Sync Shopify to Airtable"
                            className="h-12 border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-indigo-50 transition-all font-semibold"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Description (Optional)</Label>
                        <Textarea
                            placeholder="What does this workflow do?"
                            className="border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-indigo-50 transition-all min-h-[100px]"
                        />
                    </div>

                    <button className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-indigo-50 bg-indigo-50/20 hover:bg-indigo-50/40 transition-all text-left group">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <Wand2 className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">Generate with AI</span>
                                <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider">Beta</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Describe your automation and let our AI build the logic.</p>
                        </div>
                    </button>
                </div>

                <DialogFooter className="p-4 pt-0">
                    <Button
                        disabled={!name}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl text-sm font-black shadow-xl shadow-slate-200 gap-2"
                        onClick={() => onOpenChange(false)}
                    >
                        <Plus className="h-4 w-4" /> Start Building
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
