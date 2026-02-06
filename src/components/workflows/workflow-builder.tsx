"use client"

import * as React from "react"
import { useState, useCallback, useRef } from "react"
import {
    Node,
    Edge,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Connection,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    ReactFlowProvider,
} from "@xyflow/react"
import { FlowBuilder } from "./builder/flow-builder"
import { NodeSidebar } from "./builder/node-sidebar"
import { PropertiesPanel } from "./builder/properties-panel"
import { WorkflowHeader } from "./workflow-header"
import { nanoid } from "nanoid"

const initialNodes: Node[] = [
    {
        id: "trigger_1",
        type: "custom",
        position: { x: 250, y: 50 },
        data: {
            label: "Webhook Trigger",
            icon: "Globe",
            type: "trigger",
            description: "Triggered whenever an HTTP POST is received."
        },
    },
]

const initialEdges: Edge[] = []

export function WorkflowBuilder() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes)
    const [edges, setEdges] = useState<Edge[]>(initialEdges)
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

    const reactFlowWrapper = useRef<HTMLDivElement>(null)

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    )

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    )

    const onConnect: OnConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'custom' }, eds)),
        []
    )

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id)
    }, [])

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
    }, [])

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault()

            const type = event.dataTransfer.getData("application/reactflow")
            const rawData = event.dataTransfer.getData("application/nodeData")

            if (!type || !rawData) return

            const data = JSON.parse(rawData)
            const position = { x: event.clientX - 400, y: event.clientY - 100 } // Rough offset

            const newNode: Node = {
                id: `${data.id}_${nanoid(5)}`,
                type: "custom",
                position,
                data: {
                    ...data,
                    onConfigClick: () => setSelectedNodeId(newNode.id)
                },
            }

            setNodes((nds) => nds.concat(newNode))
        },
        [setNodes]
    )

    const onUpdateNode = useCallback((id: string, newData: any) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, ...newData } }
                }
                return node
            })
        )
    }, [])

    const onDeleteNode = useCallback((id: string) => {
        setNodes((nds) => nds.filter((n) => n.id !== id))
        setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id))
        setSelectedNodeId(null)
    }, [])

    const selectedNode = nodes.find((n) => n.id === selectedNodeId)

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <WorkflowHeader />
            <div className="flex flex-1 overflow-hidden">
                <ReactFlowProvider>
                    <NodeSidebar />
                    <div className="flex-1 relative" ref={reactFlowWrapper}>
                        <FlowBuilder
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onNodeClick={onNodeClick}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                        />
                    </div>
                    <PropertiesPanel
                        selectedNode={selectedNode}
                        onClose={() => setSelectedNodeId(null)}
                        onUpdate={onUpdateNode}
                        onDelete={onDeleteNode}
                    />
                </ReactFlowProvider>
            </div>
        </div>
    )
}
