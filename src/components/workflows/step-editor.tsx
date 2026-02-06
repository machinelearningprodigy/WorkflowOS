"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Settings,
    Database,
    SlidersHorizontal,
    Zap,
    ChevronRight,
    Info
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataMapper } from "./data-mapper"
import { ConditionBuilder } from "./condition-builder"
import { ActionSelector } from "./action-selector"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function StepEditor({
    step,
    onUpdate
}: {
    step: any
    onUpdate: (updates: any) => void
}) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b bg-muted/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Settings className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">Step Configuration</h2>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{step.type} • {step.id}</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="h-6 gap-1.5 px-3">
                        <Zap className="h-3 w-3 text-amber-500 fill-current" />
                        Live Step
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="action" className="flex-1 flex flex-col">
                <div className="px-6 border-b bg-card">
                    <TabsList className="h-12 bg-transparent gap-6">
                        <TabsTrigger value="action" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full gap-2">
                            <Settings className="h-4 w-4" /> Action
                        </TabsTrigger>
                        <TabsTrigger value="mapping" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full gap-2">
                            <Database className="h-4 w-4" /> Mapping
                        </TabsTrigger>
                        <TabsTrigger value="logic" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full gap-2">
                            <SlidersHorizontal className="h-4 w-4" /> Logic
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1 p-6">
                    <TabsContent value="action" className="m-0 space-y-6">
                        <div className="bg-primary/5 rounded-xl border border-primary/10 p-4 flex items-center gap-4">
                            <Info className="h-5 w-5 text-primary shrink-0" />
                            <p className="text-xs text-primary/80 leading-relaxed font-medium">
                                This step will execute the selected action using data mapped from previous steps.
                                Ensure your connection is healthy.
                            </p>
                        </div>
                        <ActionSelector onSelect={(action) => onUpdate({ action })} />
                    </TabsContent>

                    <TabsContent value="mapping" className="m-0">
                        <DataMapper
                            rules={step.mappingRules || []}
                            onAdd={() => { }}
                            onRemove={() => { }}
                            onUpdate={() => { }}
                        />
                    </TabsContent>

                    <TabsContent value="logic" className="m-0">
                        <ConditionBuilder
                            conditions={step.conditions || []}
                            onAdd={() => { }}
                            onRemove={() => { }}
                            onUpdate={() => { }}
                        />
                    </TabsContent>
                </ScrollArea>
            </Tabs>

            <div className="p-6 border-t bg-muted/20 flex items-center justify-between">
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                    View API Docs <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">Cancel</Button>
                    <Button size="sm">Save Configuration</Button>
                </div>
            </div>
        </div>
    )
}

import { ScrollArea } from "@/components/ui/scroll-area"
