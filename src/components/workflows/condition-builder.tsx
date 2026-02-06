"use client"

import * as React from "react"
import { Plus, Trash2, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export interface Condition {
    id: string
    field: string
    operator: string
    value: string
}

export function ConditionBuilder({
    conditions = [],
    onChange
}: {
    conditions: Condition[]
    onChange: (conditions: Condition[]) => void
}) {
    const addCondition = () => {
        onChange([...conditions, { id: Math.random().toString(), field: '', operator: 'equals', value: '' }])
    }

    const removeCondition = (id: string) => {
        onChange(conditions.filter(c => c.id !== id))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <SlidersHorizontal className="h-3 w-3" />
                    Logical Branches
                </div>
                <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[8px] font-black tracking-widest px-1.5 h-4">AND LOGIC</Badge>
            </div>

            <div className="space-y-3">
                {conditions.map((condition) => (
                    <div key={condition.id} className="group relative flex items-center gap-2">
                        <div className="grid grid-cols-3 gap-2 flex-1">
                            <Input
                                placeholder="Field (e.g. status)"
                                value={condition.field}
                                className="h-10 text-xs bg-muted/20 border-border/50 focus:bg-background transition-all"
                            />
                            <Select value={condition.operator}>
                                <SelectTrigger className="h-10 text-xs bg-muted/20 border-border/50">
                                    <SelectValue placeholder="Operator" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="equals">Equals</SelectItem>
                                    <SelectItem value="not_equals">Not Equals</SelectItem>
                                    <SelectItem value="contains">Contains</SelectItem>
                                    <SelectItem value="greater_than">Greater Than</SelectItem>
                                    <SelectItem value="less_than">Less Than</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Value"
                                value={condition.value}
                                className="h-10 text-xs bg-muted/20 border-border/50 focus:bg-background transition-all"
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCondition(condition.id)}
                            className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <Button
                onClick={addCondition}
                variant="outline"
                className="w-full h-11 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all gap-2 font-bold text-xs"
            >
                <Plus className="h-4 w-4" />
                Add Condition Rule
            </Button>
        </div>
    )
}
