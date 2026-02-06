'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Save, MousePointer2, Loader2, CheckCircle2, Zap, Send, MessageSquare, Database, Globe, X, Trash2 } from "lucide-react"
import Link from "next/link"
import { ReactFlow, Controls, Background, MiniMap, useNodesState, useEdgesState, ReactFlowProvider, addEdge, type Node, type Edge, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const COMPONENT_ICONS: Record<string, any> = {
    'Manual Trigger': Zap,
    'Webhook': Globe,
    'Log to Console': MousePointer2,
    'Wait 2s': Loader2,
    'Send Email': Send,
    'Slack Message': MessageSquare,
    'Database Query': Database,
};

function Editor({ id }: { id: string }) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [workflowName, setWorkflowName] = useState("Untitled Workflow");
    const [isRunning, setIsRunning] = useState(false);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    // TRPC Query for fetching workflow
    const { data: workflow, isLoading: isLoadingWorkflow, refetch } = trpc.workflow.getById.useQuery(
        { id },
        {
            enabled: id !== 'new',
            refetchOnWindowFocus: false
        }
    );

    // Populate state when data loads
    useEffect(() => {
        if (workflow) {
            setWorkflowName(workflow.name);
            const def = (workflow.definition as any) || {};
            if (def.nodes) setNodes(def.nodes);
            if (def.edges) setEdges(def.edges);
        }
    }, [workflow, setNodes, setEdges]);

    // TRPC Mutation for saving
    const updateMutation = trpc.workflow.update.useMutation({
        onSuccess: () => {
            toast({ title: "Workflow saved successfully" });
            refetch();
        },
        onError: (err) => {
            toast({ title: "Failed to save", description: err.message, variant: "destructive" });
        }
    });

    // TRPC Mutation for Execution
    const executeMutation = trpc.workflow.execute.useMutation({
        onSuccess: (run) => {
            setIsRunning(false);
            toast({ title: "Workflow execution started", description: `Run ID: ${run.id}` });
        },
        onError: (err) => {
            setIsRunning(false);
            toast({ title: "Execution failed", description: err.message, variant: "destructive" });
        }
    });

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow/type');
            const label = event.dataTransfer.getData('application/reactflow/label');

            if (!type || !label) return;

            const position = { x: event.clientX - 300, y: event.clientY - 100 }; // Rough adjustment
            const newNode: Node = {
                id: `${type}-${Date.now()}`,
                type: 'default',
                position,
                data: { label, provider: 'Manual' },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [setNodes]
    );

    const onNodeClick = useCallback((_: any, node: Node) => {
        setSelectedNode(node);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    const updateNodeData = (nodeId: string, newData: any) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, ...newData } };
                }
                return node;
            })
        );
        if (selectedNode?.id === nodeId) {
            setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, ...newData } } : null);
        }
    };

    const deleteNode = (nodeId: string) => {
        setNodes((nds) => nds.filter((n) => n.id !== nodeId));
        setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
        setSelectedNode(null);
    };

    const handleSave = useCallback(() => {
        if (!workflow) return;

        updateMutation.mutate({
            id,
            name: workflowName,
            definition: {
                nodes,
                edges,
            }
        });
    }, [id, workflowName, nodes, edges, updateMutation, workflow]);

    const handleRun = useCallback(async () => {
        if (id === 'new') return;
        setIsRunning(true);

        try {
            await updateMutation.mutateAsync({
                id,
                name: workflowName,
                definition: { nodes, edges }
            });

            executeMutation.mutate({ id });
        } catch (e) {
            setIsRunning(false);
        }
    }, [id, workflowName, nodes, edges, updateMutation, executeMutation]);

    if (isLoadingWorkflow) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
    }

    const DraggableComponent = ({ label, type, icon: Icon, color }: { label: string, type: string, icon: any, color: string }) => (
        <div
            className="p-3 bg-card border rounded shadow-sm text-sm cursor-grab active:cursor-grabbing hover:border-primary transition-all flex items-center gap-3 group"
            draggable
            onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow/type', type);
                event.dataTransfer.setData('application/reactflow/label', label);
                event.dataTransfer.effectAllowed = 'move';
            }}
        >
            <div className={`p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors`}>
                <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="font-medium">{label}</div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <header className="h-16 border-b bg-background flex items-center px-6 justify-between z-10 relative shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/workflows">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex flex-col">
                        <input
                            className="font-bold text-lg bg-transparent border-none focus:outline-none focus:ring-0 p-0 hover:bg-muted/30 px-2 rounded transition-colors"
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)}
                        />
                        <span className="text-[10px] text-muted-foreground px-2 uppercase tracking-tighter font-bold">Editing Workflow</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={handleSave} disabled={updateMutation.isLoading} className="shadow-sm">
                        {updateMutation.isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save
                    </Button>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
                        size="sm"
                        onClick={handleRun}
                        disabled={isRunning}
                    >
                        {isRunning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2 fill-current" />}
                        Run
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Components */}
                <div className="w-72 border-r bg-muted/10 flex flex-col">
                    <div className="p-4 border-b bg-background/50">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Components</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        <div>
                            <h4 className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                                <Zap className="h-3 w-3" /> Triggers
                            </h4>
                            <div className="space-y-2">
                                <DraggableComponent label="Manual Trigger" type="trigger" icon={Zap} color="text-orange-500" />
                                <DraggableComponent label="Webhook" type="trigger" icon={Globe} color="text-blue-500" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3" /> Actions
                            </h4>
                            <div className="space-y-2">
                                <DraggableComponent label="Log to Console" type="action" icon={MousePointer2} color="text-emerald-500" />
                                <DraggableComponent label="Wait 2s" type="action" icon={Loader2} color="text-purple-500" />
                                <DraggableComponent label="Send Email" type="action" icon={Send} color="text-sky-500" />
                                <DraggableComponent label="Slack Message" type="action" icon={MessageSquare} color="text-indigo-500" />
                                <DraggableComponent label="Database Query" type="action" icon={Database} color="text-amber-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-slate-50 relative overflow-hidden" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        fitView
                        className="bg-dot-pattern"
                    >
                        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
                        <Controls />
                        <MiniMap
                            nodeStrokeColor={(n: any) => {
                                if (n.type === 'trigger') return '#f97316';
                                if (n.type === 'action') return '#10b981';
                                return '#6366f1';
                            }}
                            nodeColor={(n: any) => {
                                return '#fff';
                            }}
                        />
                        <Panel position="bottom-right" className="bg-background/80 backdrop-blur-sm border p-2 rounded-lg text-[10px] font-mono shadow-sm">
                            NODES: {nodes.length} | EDGES: {edges.length}
                        </Panel>
                    </ReactFlow>
                </div>

                {/* Properties Panel */}
                <div className="w-80 border-l bg-background flex flex-col shadow-xl z-20">
                    <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                        <h3 className="font-bold text-sm uppercase tracking-tight">Properties</h3>
                        {selectedNode && (
                            <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)} className="h-6 w-6">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {!selectedNode ? (
                            <div className="p-12 h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-4">
                                <div className="p-4 rounded-full bg-muted animate-pulse">
                                    <MousePointer2 className="h-8 w-8 opacity-20" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">No node selected</p>
                                    <p className="text-xs mt-1">Select a node on the canvas to configure its properties.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            {COMPONENT_ICONS[selectedNode.data.label as string] ? (
                                                React.createElement(COMPONENT_ICONS[selectedNode.data.label as string], { className: "h-5 w-5" })
                                            ) : (
                                                <Zap className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{selectedNode.type}</div>
                                            <div className="font-bold tracking-tight">{selectedNode.data.label as string}</div>
                                        </div>
                                    </div>
                                    <Separator />
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-extrabold uppercase text-muted-foreground">General</Label>
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <Label htmlFor="node-label" className="text-xs">Display Name</Label>
                                                <Input
                                                    id="node-label"
                                                    value={selectedNode.data.label as string}
                                                    onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                                                    className="h-8 text-xs"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="node-id" className="text-xs">Node ID</Label>
                                                <Input
                                                    id="node-id"
                                                    value={selectedNode.id}
                                                    disabled
                                                    className="h-8 text-xs bg-muted opacity-50 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4">
                                        <Label className="text-[10px] font-extrabold uppercase text-muted-foreground">Settings</Label>
                                        <div className="p-4 rounded-lg bg-orange-50 border border-orange-100 text-[10px] text-orange-800 flex gap-2">
                                            <Settings2 className="h-3 w-3 shrink-0" />
                                            <p>This node is automatically configured with default parameters for development.</p>
                                        </div>
                                    </div>

                                    <div className="pt-8">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="w-full h-8 text-xs gap-2"
                                            onClick={() => deleteNode(selectedNode.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Delete Node
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

import { BackgroundVariant } from "@xyflow/react";
import { Settings2 } from "lucide-react";

export default function WorkflowEditorPage({ params }: { params: { id: string } }) {
    return (
        <ReactFlowProvider>
            <div className="bg-background h-screen">
                <Editor id={params.id} />
            </div>
        </ReactFlowProvider>
    )
}
