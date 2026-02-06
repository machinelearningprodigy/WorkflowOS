"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Rocket, Zap, Crown } from "lucide-react"

interface UpgradeModalProps {
    isOpen: boolean
    onClose: () => void
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-[2.5rem] border-0">
                <div className="bg-indigo-600 p-8 text-white relative">
                    <Rocket className="h-12 w-12 text-white/20 absolute right-6 top-6 rotate-12" />
                    <DialogTitle className="text-2xl font-bold mb-2">Upgrade to Enterprise</DialogTitle>
                    <p className="text-indigo-100 text-sm leading-relaxed">
                        Scale your automation to the next level with dedicated resources and custom SLAs.
                    </p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center">
                                <Crown className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Unlimited Everything</h4>
                                <p className="text-xs text-slate-500">No caps on executions, users, or workflows.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-pink-50 flex items-center justify-center">
                                <Zap className="h-5 w-5 text-pink-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Custom Infrastructure</h4>
                                <p className="text-xs text-slate-500">Dedicated compute and database instances.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex flex-col gap-3">
                        <Button className="w-full bg-slate-900 text-white h-12 rounded-xl text-sm font-bold shadow-xl shadow-slate-200">
                            View Enterprise Pricing
                        </Button>
                        <Button variant="ghost" onClick={onClose} className="w-full h-12 rounded-xl text-slate-400 hover:text-slate-600">
                            Maybe Later
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
