"use client"

import * as React from "react"
import { Trash2, AlertTriangle, CloudOff, FileJson, ArrowRight, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DangerZone() {
    return (
        <div className="space-y-12">
            <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-destructive">Danger Zone</h2>
                <p className="text-sm text-muted-foreground">Irreversible actions that affect your entire account and data.</p>
            </div>

            <div className="divide-y border-2 border-destructive/20 rounded-2xl bg-destructive/5 overflow-hidden shadow-xl shadow-destructive/5">
                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 transition-colors hover:bg-destructive/[0.08]">
                    <div className="space-y-2 flex-1 max-w-xl">
                        <div className="flex items-center gap-3">
                            <FileJson className="h-5 w-5 text-destructive" />
                            <h4 className="font-bold text-base tracking-tight italic">Export All Data</h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Download a complete archive of your workflows, integration metadata, and execution history in JSON format.
                            This process may take a few minutes.
                        </p>
                    </div>
                    <Button variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10 h-11 px-8 rounded-xl font-bold gap-2 whitespace-nowrap">
                        Request Export <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 transition-colors hover:bg-destructive/[0.08]">
                    <div className="space-y-2 flex-1 max-w-xl">
                        <div className="flex items-center gap-3">
                            <CloudOff className="h-5 w-5 text-destructive" />
                            <h4 className="font-bold text-base tracking-tight italic">Nuke All Workflows</h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Immediately delete every workflow and its associated run data. Your integrations will remain connected,
                            but all logic will be wiped clean.
                        </p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="secondary" className="bg-destructive/10 text-destructive hover:bg-destructive/20 h-11 px-8 rounded-xl font-bold gap-2 whitespace-nowrap border border-destructive/20">
                                Wipe Everything
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-2 border-destructive/20 shadow-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                    <ShieldAlert className="h-5 w-5" /> Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-sm font-medium leading-relaxed pt-2">
                                    This will permanently delete all your workflows. This action is irreversible and will break any
                                    active endpoints consuming these services.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="pt-6">
                                <AlertDialogCancel className="rounded-xl h-11 border-border/50">Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive hover:bg-destructive/90 rounded-xl h-11 font-bold shadow-xl shadow-destructive/20">
                                    Yes, delete all data
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <div className="p-10 border-t-4 border-destructive bg-destructive/10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2 flex-1 max-w-xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-destructive p-2 rounded-lg text-white shadow-lg shadow-destructive/20">
                                <Trash2 className="h-5 w-5" />
                            </div>
                            <h4 className="font-black text-xl tracking-tight text-destructive italic uppercase">Delete Permanently</h4>
                        </div>
                        <p className="text-sm text-destructive font-medium leading-relaxed">
                            Permanently delete your account, organization, and all associated data from WorkflowOS servers.
                            All active subscriptions will be cancelled.
                        </p>
                    </div>
                    <Button variant="destructive" className="h-14 px-10 rounded-2xl font-black italic tracking-wider shadow-2xl shadow-destructive/30 border-4 border-white/20">
                        DELETE ACCOUNT
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-center p-8 text-center text-[11px] text-muted-foreground font-bold uppercase tracking-[0.3em]">
                <AlertTriangle className="h-4 w-4 mr-3 opacity-30" />
                Proceed with extreme caution
            </div>
        </div>
    )
}
