"use client"

import { Plus, X, ArrowRight, Table as TableIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DynamicField } from "./dynamic-field"

interface Mapping {
    source: string
    target: string
}

interface FieldMapperProps {
    mappings: Mapping[]
    onChange: (mappings: Mapping[]) => void
    sourceFields: string[]
}

export function FieldMapper({ mappings, onChange, sourceFields }: FieldMapperProps) {
    const addMapping = () => {
        onChange([...mappings, { source: "", target: "" }])
    }

    const removeMapping = (index: number) => {
        onChange(mappings.filter((_, i) => i !== index))
    }

    const updateMapping = (index: number, field: keyof Mapping, value: string) => {
        const newMappings = [...mappings]
        newMappings[index][field] = value
        onChange(newMappings)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4 text-indigo-600" />
                    <h4 className="text-sm font-bold text-slate-700">Data Mapping</h4>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={addMapping}
                    className="h-8 border-dashed rounded-lg"
                >
                    <Plus className="h-3 w-3 mr-1" /> Add Field
                </Button>
            </div>

            <div className="space-y-3">
                {mappings.map((mapping, i) => (
                    <div key={i} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="flex-1">
                            <Input
                                placeholder="Target Field"
                                value={mapping.target}
                                onChange={(e) => updateMapping(i, "target", e.target.value)}
                                className="h-10 border-slate-200 bg-slate-50/50"
                            />
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 shrink-0" />
                        <div className="flex-[1.5]">
                            <DynamicField
                                label=""
                                value={mapping.source}
                                onChange={(val) => updateMapping(i, "source", val)}
                                placeholder="Source Variable"
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMapping(i)}
                            className="h-8 w-8 text-slate-400 hover:text-red-500"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            {mappings.length === 0 && (
                <div className="p-8 border border-dashed rounded-2xl text-center">
                    <p className="text-sm text-slate-400">No fields mapped yet.</p>
                </div>
            )}
        </div>
    )
}
