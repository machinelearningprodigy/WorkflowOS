'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Mail, MessageSquare, Calendar, Youtube, Map, Sparkles, Zap, Clock, Database, Webhook as WebhookIcon, CheckCircle2, AlertCircle, FileSpreadsheet, FileText, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const PROVIDER_ICONS: Record<string, any> = {
    gmail: Mail,
    slack: MessageSquare,
    'google-calendar': Calendar,
    youtube: Youtube,
    'google-maps': Map,
    'google-gemini': Sparkles,
    gemini: Sparkles,
    'google-sheets': FileSpreadsheet,
    'google-forms': FileText,
    linear: CheckSquare,
    trigger: Zap,
    wait: Clock,
    database: Database,
    webhook: WebhookIcon,
}

interface WorkflowNodeData extends Record<string, unknown> {
    label?: string
    provider?: string
    isConnected?: boolean
    hasError?: boolean
    description?: string
}

export const WorkflowNode = memo(({ data: rawData, selected }: NodeProps) => {
    const data = rawData as WorkflowNodeData
    const Icon = PROVIDER_ICONS[data?.provider?.toLowerCase() || ''] || Zap
    // Utility providers don't need "Connected" status
    const isUtility = ['trigger', 'wait', 'manual-trigger'].includes(data?.provider?.toLowerCase() || '')
    const isConnected = data?.isConnected || isUtility
    const hasError = data?.hasError

    return (
        <div
            className={cn(
                'px-6 py-4 rounded-2xl border-2 bg-white shadow-lg transition-all duration-200',
                selected && 'ring-4 ring-indigo-500/50 shadow-2xl scale-105',
                isConnected && 'border-green-500',
                !isConnected && data?.provider && 'border-amber-500',
                !data?.provider && 'border-indigo-500',
                hasError && 'border-red-500'
            )}
            style={{ minWidth: 200 }}
        >
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 !bg-indigo-500 border-2 border-white"
            />

            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        'p-2.5 rounded-xl',
                        isConnected && 'bg-green-100',
                        !isConnected && data?.provider && 'bg-amber-100',
                        !data?.provider && 'bg-indigo-100'
                    )}
                >
                    <Icon
                        className={cn(
                            'h-5 w-5',
                            isConnected && 'text-green-600',
                            !isConnected && data?.provider && 'text-amber-600',
                            !data?.provider && 'text-indigo-600'
                        )}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-900 truncate">
                        {data?.label || 'Untitled'}
                    </div>
                    {data?.provider && !isUtility && (
                        <div className="flex items-center gap-1.5 mt-1">
                            {isConnected ? (
                                <>
                                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                                    <span className="text-[10px] text-green-600 font-medium uppercase tracking-wide">
                                        Connected
                                    </span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="h-3 w-3 text-amber-600" />
                                    <span className="text-[10px] text-amber-600 font-medium uppercase tracking-wide">
                                        Not Connected
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {data?.description && (
                <div className="mt-2 text-xs text-slate-500 line-clamp-2">
                    {data.description}
                </div>
            )}

            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 !bg-indigo-500 border-2 border-white"
            />
        </div>
    )
})

WorkflowNode.displayName = 'WorkflowNode'
