"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowRight,
    Trash2,
    Plus,
    Variable,
    Settings2,
    FunctionSquare,
    Wand2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { VariablePicker } from "./builder/variable-picker"

export interface MappingRule {
    id: string
    source: string
    target: string
    transformation: string
}

export function DataMapper({
    rules = [],
    onAdd,
    onRemove,
    onUpdate
}: {
    rules?: MappingRule[]
    onAdd: () => void
    onRemove: (id: string) => void
    onUpdate: (id: string, updates: Partial<MappingRule>) => void
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Settings2 className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-bold text-sm tracking-tight uppercase">Data Mapping & Transformation</h3>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-2 bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-all">
                    <Wand2 className="h-3.5 w-3.5" />
                    AI Auto-Map
                </Button>
            </div>

            <div className="space-y-3">
                <AnimatePresence>
                    {rules.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="rounded-xl border border-dashed p-8 text-center bg-muted/20"
                        >
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                                <Variable className="h-3.5 w-3.5" />
                                No data mappings defined yet. Connect outputs to inputs.
                            </p>
                        </motion.div>
                    ) : (
                        rules.map((rule) => (
                            <motion.div
                                key={rule.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="group flex items-center gap-4 rounded-lg border bg-card/50 p-4 transition-all hover:border-primary/30"
                            >
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Source</Label>
                                        <VariablePicker onSelect={(v) => onUpdate(rule.id, { source: v })} />
                                    </div>
                                    <Input
                                        placeholder="{{body.user}}"
                                        value={rule.source}
                                        onChange={(e) => onUpdate(rule.id, { source: e.target.value })}
                                        className="h-8 text-xs font-mono bg-muted/40"
                                    />
                                </div>

                                <div className="flex flex-col items-center gap-1 shrink-0 pt-4">
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    <Select
                                        value={rule.transformation}
                                        onValueChange={(val) => onUpdate(rule.id, { transformation: val })}
                                    >
                                        <SelectTrigger className="h-6 w-24 text-[10px] px-2 bg-primary/5 border-primary/10 text-primary uppercase font-bold">
                                            <SelectValue placeholder="Map" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Direct</SelectItem>
                                            <SelectItem value="uppercase">UPPERCASE</SelectItem>
                                            <SelectItem value="lowercase">lowercase</SelectItem>
                                            <SelectItem value="format_date">Format Date</SelectItem>
                                            <SelectItem value="json_parse">Parse JSON</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex-1 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Target Field</Label>
                                    </div>
                                    <Input
                                        placeholder="recipient_email"
                                        value={rule.target}
                                        onChange={(e) => onUpdate(rule.id, { target: e.target.value })}
                                        className="h-8 text-xs font-mono bg-muted/40"
                                    />
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity mt-4"
                                    onClick={() => onRemove(rule.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="flex justify-center pt-4">
                <Button onClick={onAdd} variant="outline" size="sm" className="gap-2 border-dashed">
                    <Plus className="h-4 w-4" />
                    Add Mapping Rule
                </Button>
            </div>
        </div>
    )
}

import { Label } from "@/components/ui/label"
