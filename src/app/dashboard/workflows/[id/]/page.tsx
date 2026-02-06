'use client'

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Play, Save, MousePointer2, Loader2, CheckCircle2,
    Zap, Send, MessageSquare, Database, Globe, X, Trash2, Settings2,
    History, Info
} from "lucide-react";
import Link from "next/link";
import {
    ReactFlow, Controls, Background, MiniMap, useNodesState,
    useEdgesState, ReactFlowProvider, addEdge, type Node, type Edge, Panel,
    BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [workflowName, setWorkflowName] = useState("Untitled Workflow");
    const [isRunning, setIsRunning] = useState(false);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [rightTabs, setRightTabs] = useState<'inspector' | 'history'>('inspector');

    // TRPC Query for fetching workflow
    const { data: workflow, isLoading: isLoadingWorkflow, refetch } = trpc.workflow.getById.useQuery(
        { id },
        {
            enabled: id !== 'new',
            refetchOnWindowFocus: false
        }
    );

    // TRPC Query for execution history
    const { data: historyData, refetch: refetchHistory } = trpc.workflow.getExecutions.useQuery(
        { workflowId: id },
        { enabled: id !== 'new', refetchInterval: isRunning ? 2000 : 0 }
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
        onError: (err: any) => {
            toast({ title: "Failed to save", description: err.message, variant: "destructive" });
        }
    });

    // TRPC Mutation for Execution
    const executeMutation = trpc.workflow.execute.useMutation({
        onSuccess: (run: any) => {
            setIsRunning(false);
            toast({ title: "Workflow execution started", description: `Run ID: ${run.id}` });
            refetchHistory();
            setRightTabs('history');
        },
        onError: (err: any) => {
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

            const position = { x: event.clientX - 400, y: event.clientY - 200 };
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
        setRightTabs('inspector');
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
        return (
            <div className="h-full w-full flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
                    <p className="text-sm font-medium text-muted-foreground">Initializing Engine...</p>
                </div>
            </div>
        );
    }

    const DraggableComponent = ({ label, type, icon: Icon, color }: { label: string, type: string, icon: any, color: string }) => (
        <div
            className="p-3 bg-card border rounded-xl shadow-sm text-sm cursor-grab active:cursor-grabbing hover:border-indigo-500 hover:shadow-md transition-all flex items-center gap-3 group"
            draggable
            onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow/type', type);
                event.dataTransfer.setData('application/reactflow/label', label);
                event.dataTransfer.effectAllowed = 'move';
            }}
        >
            <div className={`p-2 rounded-lg bg-muted group-hover:bg-indigo-50 transition-colors`}>
                <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="font-semibold text-slate-700">{label}</div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
            <header className="h-16 border-b bg-background/80 backdrop-blur-md flex items-center px-6 justify-between z-10 relative">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/workflows">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="h-8 w-[1px] bg-border mx-2" />
                    <div className="flex flex-col">
                        <input
                            className="font-bold text-lg bg-transparent border-none focus:outline-none focus:ring-0 p-0 hover:bg-muted/50 px-2 rounded transition-colors w-64 truncate"
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)}
                        />
                        <span className="text-[10px] text-indigo-500 px-2 uppercase tracking-widest font-black">Design Mode</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={handleSave} disabled={updateMutation.isLoading} className="rounded-lg px-4 border-slate-200">
                        {updateMutation.isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save
                    </Button>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 rounded-lg px-6"
                        size="sm"
                        onClick={handleRun}
                        disabled={isRunning}
                    >
                        {isRunning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2 fill-current" />}
                        Execute
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <div className="w-72 border-r bg-slate-50/50 flex flex-col">
                    <div className="p-4 border-b bg-white flex items-center justify-between">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Library</h3>
                        <div className="p-1 px-2 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">V1.0</div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-8">
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest flex items-center gap-2">
                                < Zap className="h-3 w-3 text-orange-500" /> Triggers
                            </h4>
                            <div className="space-y-3">
                                <DraggableComponent label="Manual Trigger" type="trigger" icon={Zap} color="text-orange-500" />
                                <DraggableComponent label="Webhook" type="trigger" icon={Globe} color="text-blue-500" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Actions
                            </h4>
                            <div className="space-y-3">
                                <DraggableComponent label="Log to Console" type="action" icon={MousePointer2} color="text-emerald-500" />
                                <DraggableComponent label="Wait 2s" type="action" icon={Loader2} color="text-purple-500" />
                                <DraggableComponent label="Send Email" type="action" icon={Send} color="text-sky-500" />
                                <DraggableComponent label="Slack Message" type="action" icon={MessageSquare} color="text-indigo-500" />
                                <DraggableComponent label="Database Query" type="action" icon={Database} color="text-amber-500" />
                            </div>
                        </div>
                        <div className="pt-8 border-t border-slate-200 opacity-50">
                            <h4 className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2 italic">
                                <Settings2 className="h-3 w-3" /> Advanced Coming Soon
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-[#fbfcfd] relative overflow-hidden" ref={reactFlowWrapper}>
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
                    >
                        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#e2e8f0" />
                        <Controls className="bg-white border-slate-200 shadow-xl rounded-xl overflow-hidden" />
                        <MiniMap
                            nodeStrokeColor="#6366f1"
                            nodeColor="#f8fafc"
                            maskColor="rgba(241, 245, 249, 0.7)"
                            style={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        />
                        <Panel position="bottom-right" className="bg-white/90 backdrop-blur-sm border border-slate-200 p-2.5 rounded-2xl text-[10px] font-mono shadow-sm flex gap-6 px-4">
                            <span className="flex items-center gap-2 font-bold text-slate-600"><div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" /> {nodes.length} COMPONENTS</span>
                            <span className="flex items-center gap-2 font-bold text-slate-600"><div className="h-2 w-2 rounded-full bg-slate-200" /> {edges.length} CONNECTIONS</span>
                        </Panel>
                    </ReactFlow>
                </div>

                <div className="w-80 border-l bg-white flex flex-col shadow-2xl z-20">
                    <div className="flex items-center border-b bg-slate-50/50 p-1">
                        <button
                            onClick={() => setRightTabs('inspector')}
                            className={cn(
                                "flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-lg",
                                rightTabs === 'inspector' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Inspector
                        </button>
                        <button
                            onClick={() => setRightTabs('history')}
                            className={cn(
                                "flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-lg",
                                rightTabs === 'history' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            History
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {rightTabs === 'inspector' ? (
                            <div className="h-full">
                                {!selectedNode ? (
                                    <div className="p-12 h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-6">
                                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner">
                                            <MousePointer2 className="h-8 w-8 opacity-20" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-600">Select an Element</p>
                                            <p className="text-xs mt-2 leading-relaxed">Choose a node on the canvas to inspect and configure its parameters.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                                    {COMPONENT_ICONS[selectedNode.data.label as string] ? (
                                                        React.createElement(COMPONENT_ICONS[selectedNode.data.label as string], { className: "h-6 w-6" })
                                                    ) : (
                                                        <Zap className="h-6 w-6" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1">{selectedNode.type}</div>
                                                    <div className="font-bold text-slate-900 tracking-tight">{selectedNode.data.label as string}</div>
                                                </div>
                                            </div>
                                            <Separator className="bg-slate-100" />
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Configuration</Label>
                                                <div className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="node-label" className="text-xs font-semibold text-slate-700">Display Label</Label>
                                                        <Input
                                                            id="node-label"
                                                            value={selectedNode.data.label as string}
                                                            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                                                            className="h-10 text-sm rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5 opacity-60">
                                                        <Label htmlFor="node-id" className="text-xs font-semibold text-slate-700">Reference ID</Label>
                                                        <Input
                                                            id="node-id"
                                                            value={selectedNode.id}
                                                            disabled
                                                            className="h-10 text-sm bg-slate-50 font-mono rounded-lg border-slate-200 cursor-not-allowed"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-4 border-t border-slate-50">
                                                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Execution Settings</Label>
                                                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 text-[11px] text-orange-700 flex gap-3 leading-relaxed">
                                                    <Settings2 className="h-4 w-4 shrink-0 mt-0.5" />
                                                    <p>This node is operating with <strong>Auto-Config</strong>. Advanced parameters are locked in this version.</p>
                                                </div>
                                            </div>

                                            <div className="pt-8">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full h-10 text-xs gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-bold"
                                                    onClick={() => deleteNode(selectedNode.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete Component
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recent Executions</Label>
                                    <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold text-indigo-500" onClick={() => refetchHistory()}>Refresh</Button>
                                </div>

                                {!historyData?.executions.length ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                                        <History className="h-8 w-8 text-slate-200" />
                                        <p className="text-xs text-slate-400">No execution history yet. Click 'Execute' to start.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {historyData.executions.map((run: any) => (
                                            <div key={run.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 space-y-2 hover:border-slate-200 transition-colors group">
                                                <div className="flex items-center justify-between">
                                                    <Badge className={cn(
                                                        "text-[8px] h-4 px-1 leading-none uppercase tracking-tighter",
                                                        run.status === 'completed' ? "bg-emerald-500" :
                                                            run.status === 'running' ? "bg-indigo-500 animate-pulse" : "bg-slate-400"
                                                    )}>
                                                        {run.status}
                                                    </Badge>
                                                    <span className="text-[9px] font-mono text-slate-400 group-hover:text-slate-600">
                                                        {formatDistanceToNow(new Date(run.started_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-[10px]">
                                                    <span className="text-slate-500">ID: ...{run.id.slice(-6)}</span>
                                                    <span className="font-bold text-slate-700">{run.duration_ms || 0}ms</span>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-[10px] text-indigo-700 flex gap-2">
                                            <Info className="h-3 w-3 shrink-0" />
                                            <p>Showing last 50 executions. Detailed step logs are available in the specialized viewer.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function WorkflowEditorPage({ params }: { params: { id: string } }) {
    return (
        <ReactFlowProvider>
            <div className="bg-background h-screen overflow-hidden">
                <Editor id={params.id} />
            </div>
        </ReactFlowProvider>
    );
}
