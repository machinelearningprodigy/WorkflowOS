"use client"

import { useState } from "react"
import { WorkflowCard, Workflow } from "./workflow-card"
import { WorkflowFilters } from "./workflow-filters"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingState } from "@/components/ui/loading-state"
import { Search, Grid3X3, List as ListIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function WorkflowList({
    workflows,
    isLoading,
    onCreateNew,
}: {
    workflows: Workflow[]
    isLoading: boolean
    onCreateNew: () => void
}) {
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const [search, setSearch] = useState('')

    if (isLoading) {
        return <LoadingState title="Loading workflows..." />
    }

    if (workflows.length === 0) {
        return (
            <EmptyState
                title="No workflows found"
                description="Get started by creating your first automated workflow."
                actionLabel="Create Workflow"
                onAction={onCreateNew}
            />
        )
    }

    const filteredWorkflows = workflows.filter(w =>
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.description?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search workflows..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <WorkflowFilters />
                    <div className="h-8 w-px bg-border mx-2 hidden md:block" />
                    <div className="flex items-center rounded-lg border bg-background p-1">
                        <Button
                            variant={view === 'grid' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setView('grid')}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={view === 'list' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setView('list')}
                        >
                            <ListIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {filteredWorkflows.length === 0 ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed py-12">
                    <p className="text-muted-foreground text-sm">No workflows match your search.</p>
                </div>
            ) : (
                <div className={cn(
                    "grid gap-6",
                    view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}>
                    {filteredWorkflows.map((workflow) => (
                        <WorkflowCard
                            key={workflow.id}
                            workflow={workflow}
                            onEdit={() => { }}
                            onToggle={() => { }}
                            onDelete={() => { }}
                            onExecute={() => { }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

import { cn } from "@/lib/utils"
