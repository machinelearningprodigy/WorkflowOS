'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { trpc } from '@/utils/trpc'
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas'
import { useEffect, useState } from 'react'

export default function WorkflowEditorPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [initialNodes, setInitialNodes] = useState<any[]>([])
    const [initialEdges, setInitialEdges] = useState<any[]>([])

    const { data: workflow, isLoading } = trpc.workflow.getById.useQuery(
        { id },
        {
            enabled: id !== 'new',
            refetchOnWindowFocus: false,
        }
    )

    useEffect(() => {
        if (workflow?.definition) {
            const def = workflow.definition as any
            setInitialNodes(def.nodes || [])
            setInitialEdges(def.edges || [])
        }
    }, [workflow])

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/workflows">
                        <Button variant="ghost" size="icon" className="rounded-xl">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">
                            {workflow?.name || 'New Workflow'}
                        </h1>
                        <p className="text-xs text-slate-500">
                            {workflow?.description || 'Design your automation'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1">
                <WorkflowCanvas
                    workflowId={id}
                    initialNodes={initialNodes}
                    initialEdges={initialEdges}
                />
            </div>
        </div>
    )
}
