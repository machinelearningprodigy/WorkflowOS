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
import { Label } from "@/components/ui/label"
import { Key, Sparkles } from "lucide-react"

interface CreateAPIKeyProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateAPIKey({ isOpen, onOpenChange }: CreateAPIKeyProps) {
    const [name, setName] = useState("")

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-0">
                <DialogHeader className="p-4 pt-8">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                        <Key className="h-6 w-6 text-indigo-600" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-slate-900 leading-tight">Create New API Key</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">
                        Give your key a descriptive name to help you identify it later.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4 space-y-6">
                    <div className="space-y-3">
                        <Label htmlFor="key-name" className="text-xs font-black uppercase tracking-widest text-slate-400">Key Name</Label>
                        <Input
                            id="key-name"
                            placeholder="e.g. Production Mobile App"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12 border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-indigo-50 transition-all"
                        />
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                        <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                            <span className="font-black">Security Note:</span> Once generated, you will only be able to see the full key once. Please save it securely.
                        </p>
                    </div>
                </div>
                <DialogFooter className="p-4 pt-0">
                    <Button
                        disabled={!name}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl text-sm font-black shadow-xl shadow-slate-200 gap-2"
                        onClick={() => onOpenChange(false)}
                    >
                        <Sparkles className="h-4 w-4" /> Generate Key
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
