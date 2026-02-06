"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle, X } from "lucide-react"

interface DeleteWorkflowModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    workflowName: string
    onConfirm: () => void
}

export function DeleteWorkflowModal({
    isOpen,
    onOpenChange,
    workflowName,
    onConfirm
}: DeleteWorkflowModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] border-0 p-0 overflow-hidden">
                <div className="bg-red-50 p-8 flex justify-center">
                    <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center shadow-xl shadow-red-100 ring-8 ring-red-50">
                        <Trash2 className="h-10 w-10 text-red-600" />
                    </div>
                </div>

                <div className="p-8 space-y-6 pt-10">
                    <div className="text-center space-y-2">
                        <DialogTitle className="text-2xl font-black text-slate-900 leading-tight">Delete Workflow?</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium leading-relaxed">
                            Are you sure you want to delete <span className="font-extrabold text-slate-900">"{workflowName}"</span>? This action is permanent and cannot be undone.
                        </DialogDescription>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                            Deleting this workflow will also permanently remove all of its execution history and version data.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button
                            onClick={onConfirm}
                            className="w-full bg-red-600 hover:bg-red-700 text-white h-12 rounded-xl text-sm font-black shadow-xl shadow-red-100"
                        >
                            Yes, Delete Permanently
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="w-full h-12 rounded-xl text-slate-400 hover:text-slate-600 font-bold"
                        >
                            No, Keep Workflow
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
