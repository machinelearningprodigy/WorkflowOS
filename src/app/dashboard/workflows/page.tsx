'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreVertical, Play, Pause, Pencil, Trash, Loader2 } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { trpc } from "@/utils/trpc"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

export default function WorkflowsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const { toast } = useToast()
    const utils = trpc.useContext()

    const { data, isLoading } = trpc.workflow.list.useQuery({
        limit: 50,
        filter: 'all'
    })

    const deleteMutation = trpc.workflow.delete.useMutation({
        onSuccess: () => {
            toast({ title: "Workflow deleted" })
            utils.workflow.list.invalidate()
        }
    })

    const toggleMutation = trpc.workflow.toggleActive.useMutation({
        onSuccess: () => {
            utils.workflow.list.invalidate()
        }
    })

    const runMutation = trpc.workflow.execute.useMutation({
        onSuccess: () => {
            toast({ title: "Workflow execution started" })
        }
    })

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this workflow?")) {
            deleteMutation.mutate({ id })
        }
    }

    const filteredWorkflows = data?.workflows.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Workflows</h2>
                    <p className="text-muted-foreground">
                        Manage and monitor your automation pipelines.
                    </p>
                </div>
                <Link href="/dashboard/workflows/new">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
                        <Plus className="mr-2 h-4 w-4" /> New Workflow
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search workflows..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            ) : filteredWorkflows.length === 0 ? (
                <div className="text-center py-20 border rounded-xl bg-slate-50">
                    <h3 className="text-lg font-medium text-slate-900">No workflows found</h3>
                    <p className="text-slate-500 mt-2">Get started by creating your first automation.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredWorkflows.map((workflow) => (
                        <Card key={workflow.id} className="hover:shadow-md transition-shadow group">
                            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                <div className="flex-1 overflow-hidden">
                                    <CardTitle className="text-lg flex items-center gap-2 truncate">
                                        <span className="truncate" title={workflow.name}>{workflow.name}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold shrink-0 ${workflow.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {workflow.is_active ? 'Active' : 'Paused'}
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="mt-1 line-clamp-2 min-h-[40px]">
                                        {workflow.description || "No description"}
                                    </CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="sr-only">Open menu</span>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => runMutation.mutate({ id: workflow.id })}>
                                            <Play className="mr-2 h-4 w-4" /> Run Now
                                        </DropdownMenuItem>
                                        <Link href={`/dashboard/workflows/${workflow.id}`}>
                                            <DropdownMenuItem>
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(workflow.id)}>
                                            <Trash className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 border-t pt-4">
                                    <div>
                                        {workflow.last_run_at ? (
                                            <span>Run {formatDistanceToNow(new Date(workflow.last_run_at))} ago</span>
                                        ) : (
                                            <span>Never run</span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
