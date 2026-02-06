'use client'

import { useCallback, useEffect, useState } from 'react'
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    type Node,
    type Edge,
    type Connection,
    Panel,
    NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { WorkflowNode } from './WorkflowNode'
import { NodeProperties } from './NodeProperties'
import { Sparkles, Play, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trpc } from '@/utils/trpc'
import { useToast } from '@/components/ui/use-toast'

const nodeTypes: NodeTypes = {
    workflow: WorkflowNode,
}

interface WorkflowCanvasProps {
    workflowId: string
    initialNodes?: Node[]
    initialEdges?: Edge[]
}

export function WorkflowCanvas({ workflowId, initialNodes = [], initialEdges = [] }: WorkflowCanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
    const [aiPrompt, setAiPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const { toast } = useToast()
    const utils = trpc.useContext()

    // Fetch connections for integration status
    const { data: connections = [] } = trpc.integration.list.useQuery()

    // Save workflow mutation
    const saveMutation = trpc.workflow.update.useMutation({
        onSuccess: () => {
            toast({ title: 'Workflow saved successfully' })
            utils.workflow.getById.invalidate({ id: workflowId })
        },
        onError: (err) => {
            toast({ title: 'Failed to save', description: err.message, variant: 'destructive' })
        },
    })

    // Execute workflow mutation
    const executeMutation = trpc.workflow.execute.useMutation({
        onSuccess: (run) => {
            toast({ title: 'Workflow started', description: `Run ID: ${run.id}` })
        },
        onError: (err) => {
            toast({ title: 'Execution failed', description: err.message, variant: 'destructive' })
        },
    })

    // AI workflow generation mutation
    const generateMutation = trpc.workflow.generateFromPrompt.useMutation({
        onSuccess: (result) => {
            setNodes(result.nodes)
            setEdges(result.edges)
            setIsGenerating(false)
            toast({ title: 'Workflow generated!', description: 'Review and customize your AI-generated workflow' })

            // Auto-save the generated workflow
            setTimeout(() => {
                saveMutation.mutate({
                    id: workflowId,
                    definition: { nodes: result.nodes, edges: result.edges },
                })
            }, 500)
        },
        onError: (err) => {
            setIsGenerating(false)
            toast({ title: 'Generation failed', description: err.message, variant: 'destructive' })
        },
    })

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }, eds)),
        [setEdges]
    )

    // Sync initial nodes and edges when they change
    useEffect(() => {
        if (initialNodes.length > 0 || initialEdges.length > 0) {
            setNodes(initialNodes)
            setEdges(initialEdges)
        } else if (nodes.length === 0) {
            // Add a starter trigger node for empty workflows
            setNodes([
                {
                    id: 'trigger-start',
                    type: 'workflow',
                    position: { x: 250, y: 100 },
                    data: {
                        label: 'Start Here',
                        provider: 'trigger',
                        description: 'Click "Generate" above to create your workflow with AI',
                    },
                },
            ])
        }
    }, [initialNodes, initialEdges, setNodes, setEdges, nodes.length])

    const handleSave = () => {
        saveMutation.mutate({
            id: workflowId,
            definition: { nodes, edges },
        })
    }

    const handleRun = () => {
        executeMutation.mutate({ id: workflowId })
    }

    const handleAIGenerate = () => {
        if (!aiPrompt.trim()) {
            toast({ title: 'Enter a prompt', description: 'Describe what you want your workflow to do', variant: 'destructive' })
            return
        }
        setIsGenerating(true)
        generateMutation.mutate({ prompt: aiPrompt, workflowId })
    }

    // Update nodes with connection status
    useEffect(() => {
        if (connections.length === 0) return

        setNodes((nds) =>
            nds.map((node) => {
                const provider = node.data?.provider
                if (provider) {
                    const isConnected = connections.some((c) => c.provider_slug === provider && c.status === 'connected')
                    // Only update if connection status changed
                    if (node.data?.isConnected !== isConnected) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                isConnected,
                            },
                        }
                    }
                }
                return node
            })
        )
    }, [connections, setNodes])

    const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id)
    }, [])

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null)
    }, [])

    const updateNodeData = useCallback((nodeId: string, newData: any) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...newData,
                        },
                    }
                }
                return node
            })
        )
    }, [setNodes])

    // Derive selected node from current nodes state to ensure data is fresh
    const selectedNode = nodes.find(n => n.id === selectedNodeId) || null

    return (
        <div className="h-full w-full relative flex overflow-hidden">
            <div className="flex-1 relative">
                {/* AI Prompt Bar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-2xl px-4">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 p-4">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                                <Input
                                    placeholder="Describe your workflow... (e.g., 'Send email when form submitted')"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAIGenerate()}
                                    className="pl-11 h-12 text-base border-0 focus-visible:ring-0 bg-transparent"
                                    disabled={isGenerating}
                                />
                            </div>
                            <Button
                                onClick={handleAIGenerate}
                                disabled={isGenerating}
                                className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-100 transition-all scale-100 active:scale-95"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Generate
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-slate-50"
                    defaultEdgeOptions={{
                        animated: true,
                        style: { stroke: '#6366f1', strokeWidth: 2 },
                    }}
                >
                    <Background color="#cbd5e1" gap={16} variant="dots" />
                    <Controls className="bg-white rounded-xl shadow-lg border-slate-200" />
                    <MiniMap
                        className="bg-white rounded-xl shadow-lg border-slate-200"
                        nodeColor={(node) => {
                            if (node.data?.isConnected) return '#10b981'
                            if (node.data?.provider) return '#f59e0b'
                            return '#6366f1'
                        }}
                    />

                    {/* Action Panel */}
                    <Panel position="top-right" className="space-x-3">
                        <Button
                            onClick={handleRun}
                            disabled={executeMutation.isLoading}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100 rounded-xl px-5 h-11 transition-all active:scale-95 flex items-center gap-2"
                        >
                            {executeMutation.isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Play className="mr-2 h-4 w-4" />
                            )}
                            <span className="font-bold">Run Workflow</span>
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saveMutation.isLoading}
                            variant="outline"
                            className="bg-white border-slate-200 text-slate-700 shadow-lg shadow-slate-100 rounded-xl px-5 h-11 transition-all active:scale-95 hover:bg-slate-50 flex items-center gap-2"
                        >
                            {saveMutation.isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4 text-indigo-500" />
                            )}
                            <span className="font-semibold">Save</span>
                        </Button>
                    </Panel>
                </ReactFlow>
            </div>

            {/* Properties Sidebar */}
            {selectedNode && (
                <NodeProperties
                    selectedNode={selectedNode}
                    onClose={() => setSelectedNodeId(null)}
                    onUpdate={updateNodeData}
                    isConnected={connections.some(c => c.provider_slug === selectedNode.data?.provider && c.status === 'connected')}
                />
            )}
        </div>
    )
}
