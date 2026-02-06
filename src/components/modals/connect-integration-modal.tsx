"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowRight, Plug2, Info } from "lucide-react"

interface ConnectIntegrationModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    integration: {
        name: string
        icon: string
        provider: string
    }
}

export function ConnectIntegrationModal({
    isOpen,
    onOpenChange,
    integration
}: ConnectIntegrationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-0 p-0 overflow-hidden">
                <div className="bg-indigo-600 p-10 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-2xl">
                            <Plug2 className="h-8 w-8 text-indigo-600" />
                        </div>
                        <ArrowRight className="h-6 w-6 text-white/50" />
                        <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-2xl overflow-hidden p-3">
                            <img src={integration.icon} alt={integration.name} className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <DialogTitle className="text-2xl font-black text-slate-900 leading-tight">
                            Connect {integration.name}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium leading-relaxed">
                            WorkflowOS needs permission to read and write data to your {integration.name} account to run automations.
                        </DialogDescription>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-slate-800 tracking-tight">Secure OAuth Connection</h4>
                                <p className="text-[11px] text-slate-500 font-medium leading-normal">
                                    We never see your password. You'll be redirected to {integration.name} to authorize access securely.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-blue-800 tracking-tight">Scope of Access</h4>
                                <p className="text-[11px] text-blue-600 font-medium leading-normal">
                                    We only request the specific permissions needed to execute actions in your workflows.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl text-sm font-black shadow-xl shadow-slate-200"
                        >
                            Authorize with {integration.name}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="w-full h-12 rounded-xl text-slate-400 hover:text-slate-600 font-bold"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
