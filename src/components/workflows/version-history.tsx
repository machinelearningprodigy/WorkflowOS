"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { History, RotateCcw, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface Version {
    id: string
    versionNum: string
    updatedAt: string
    updatedBy: string
    isCurrent?: boolean
}

export function VersionHistory({
    versions = [],
    onRestore
}: {
    versions?: Version[]
    onRestore: (id: string) => void
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 px-1">
                <History className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm tracking-tight">Timeline History</h3>
            </div>

            <div className="space-y-3">
                {versions.map((version, index) => (
                    <motion.div
                        key={version.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-muted/30 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground border">
                                <User className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm">v{version.versionNum}</span>
                                    {version.isCurrent && (
                                        <Badge className="text-[8px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-1.5 h-4 font-black">ACTIVE</Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-0.5">
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> {version.updatedAt}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">• {version.updatedBy}</span>
                                </div>
                            </div>
                        </div>

                        {!version.isCurrent && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRestore(version.id)}
                                className="opacity-0 group-hover:opacity-100 transition-all font-bold text-[10px] h-8 gap-2 hover:text-primary"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                RESTORE
                            </Button>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
