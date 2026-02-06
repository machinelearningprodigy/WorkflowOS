"use client"

import * as React from "react"
import { Settings2, X, Play, Trash2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VariablePicker } from "./variable-picker"

export function PropertiesPanel({
    selectedNode,
    onClose,
    onUpdate,
    onDelete,
}: {
    selectedNode: any
    onClose: () => void
    onUpdate: (id: string, data: any) => void
    onDelete: (id: string) => void
}) {
    if (!selectedNode) {
        return (
            <div className="flex h-full w-80 items-center justify-center border-l bg-card/50 text-center p-8">
                <div className="space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Info className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Select a step to configure its properties and data mapping.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full w-80 flex-col border-l bg-card/50 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2 font-bold">
                    <Settings2 className="h-4 w-4" />
                    Settings
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4">
                    <div className="mb-6 rounded-lg border bg-muted/30 p-3">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                <Settings2 className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">{selectedNode.data.label}</h4>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Node ID: {selectedNode.id}</p>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="config" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="config">Config</TabsTrigger>
                            <TabsTrigger value="data">Output</TabsTrigger>
                        </TabsList>

                        <TabsContent value="config" className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label>Step Name</Label>
                                <Input
                                    value={selectedNode.data.label}
                                    onChange={(e) => onUpdate(selectedNode.id, { label: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="What does this step do?"
                                    value={selectedNode.data.description}
                                    onChange={(e) => onUpdate(selectedNode.id, { description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <Label className="uppercase tracking-widest text-[10px] text-muted-foreground font-bold">Data Mapping</Label>
                                    <VariablePicker onSelect={(v) => {
                                        const current = selectedNode.data.description || ""
                                        onUpdate(selectedNode.id, { description: current + " " + v })
                                    }} />
                                </div>
                                <div className="rounded-lg border border-dashed p-4 text-center">
                                    <p className="text-xs text-muted-foreground">
                                        Map variables from previous steps to use in this step.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <Button variant="outline" className="w-full gap-2 mb-2">
                                    <Play className="h-4 w-4" />
                                    Test Step
                                </Button>
                                <Button variant="destructive" className="w-full gap-2" onClick={() => onDelete(selectedNode.id)}>
                                    <Trash2 className="h-4 w-4" />
                                    Delete Step
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="data" className="py-4">
                            <div className="rounded-md border bg-zinc-950 p-4 font-mono text-xs text-zinc-400">
                                <pre>{JSON.stringify(selectedNode.data, null, 2)}</pre>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>
        </div>
    )
}
