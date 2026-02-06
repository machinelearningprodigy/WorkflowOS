"use client"

import * as React from "react"
import {
    ReactFlow,
    Controls,
    Background,
    Edge,
    Node,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    Panel,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { CustomNode } from "./custom-node"
import { CustomEdge } from "./custom-edge"
import { Button } from "@/components/ui/button"
import { Play, Save, Wand2 } from "lucide-react"

const nodeTypes = {
    custom: CustomNode,
}

const edgeTypes = {
    custom: CustomEdge,
}

export function FlowBuilder({
    nodes: initialNodes,
    edges: initialEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onDragOver,
    onDrop,
}: {
    nodes: Node[]
    edges: Edge[]
    onNodesChange: OnNodesChange
    onEdgesChange: OnEdgesChange
    onConnect: OnConnect
    onNodeClick: (event: React.MouseEvent, node: Node) => void
    onDragOver: (event: React.DragEvent) => void
    onDrop: (event: React.DragEvent) => void
}) {
    return (
        <div className="h-full w-full bg-slate-50/50 dark:bg-slate-950/50">
            <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onDragOver={onDragOver}
                onDrop={onDrop}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                snapToGrid
                snapGrid={[15, 15]}
                className="workflow-flow"
            >
                <Background gap={12} size={1} />
                <Controls className="!bg-background !border-border !fill-foreground" />

                <Panel position="top-right" className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2 bg-background shadow-lg">
                        <Wand2 className="h-4 w-4" />
                        Auto Layout
                    </Button>
                    <Button size="sm" variant="default" className="gap-2 shadow-lg shadow-primary/20">
                        <Save className="h-4 w-4" />
                        Save Workflow
                    </Button>
                    <Button size="sm" variant="secondary" className="gap-2 bg-background shadow-lg border-primary/20 text-primary">
                        <Play className="h-4 w-4" />
                        Test Run
                    </Button>
                </Panel>
            </ReactFlow>
        </div>
    )
}
