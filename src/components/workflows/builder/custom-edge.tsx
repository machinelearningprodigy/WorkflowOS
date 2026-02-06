"use client"

import * as React from "react"
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from "@xyflow/react"
import { X } from "lucide-react"

export function CustomEdge({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
}: EdgeProps) {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={{
                ...style,
                strokeWidth: 2,
                stroke: "hsl(var(--primary))",
                opacity: 0.5
            }} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: "all",
                    }}
                    className="nodrag nopan"
                >
                    <button
                        className="group flex h-5 w-5 items-center justify-center rounded-full border bg-background text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
                        onClick={(event) => {
                            event.stopPropagation()
                        }}
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    )
}
