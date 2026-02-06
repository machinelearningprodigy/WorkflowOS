import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/ai/optimize
 * Provides AI-powered optimization suggestions for a workflow.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { workflowId } = body

        if (!workflowId) {
            return NextResponse.json({
                error: 'workflowId is required'
            }, { status: 400 })
        }

        const workflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                creatorId: user.id
            },
            include: {
                steps: {
                    orderBy: { order: 'asc' }
                },
                runs: {
                    orderBy: { startTime: 'desc' },
                    take: 10
                }
            }
        })

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
        }

        // Generate optimization suggestions based on workflow analysis
        const suggestions = []

        // Check for redundant steps
        const stepTypes = workflow.steps.map(s => `${s.provider}-${s.action}`)
        const duplicates = stepTypes.filter((item, index) => stepTypes.indexOf(item) !== index)
        if (duplicates.length > 0) {
            suggestions.push({
                type: 'redundancy',
                severity: 'medium',
                title: 'Redundant Steps Detected',
                description: 'Some steps appear to be duplicated. Consider consolidating them.',
                impact: 'Reduces execution time by 20-30%'
            })
        }

        // Check execution performance
        const avgDuration = workflow.runs.reduce((sum, r) => sum + (r.duration || 0), 0) / workflow.runs.length
        if (avgDuration > 10000) {
            suggestions.push({
                type: 'performance',
                severity: 'high',
                title: 'Slow Execution Time',
                description: 'This workflow takes longer than average to execute. Consider parallelizing independent steps.',
                impact: 'Could reduce execution time by up to 50%'
            })
        }

        // Check error rate
        const failedRuns = workflow.runs.filter(r => r.status === 'failed').length
        const errorRate = (failedRuns / workflow.runs.length) * 100
        if (errorRate > 10) {
            suggestions.push({
                type: 'reliability',
                severity: 'high',
                title: 'High Failure Rate',
                description: `${errorRate.toFixed(1)}% of executions are failing. Add error handling and retry logic.`,
                impact: 'Improves success rate significantly'
            })
        }

        // Check for missing error handling
        const hasErrorHandling = workflow.steps.some(s => s.config && (s.config as any).onError)
        if (!hasErrorHandling) {
            suggestions.push({
                type: 'best_practice',
                severity: 'low',
                title: 'Add Error Handling',
                description: 'No error handling detected. Add fallback actions for critical steps.',
                impact: 'Increases workflow reliability'
            })
        }

        logger.info(`Optimization suggestions generated for workflow ${workflowId}`)

        return NextResponse.json({
            success: true,
            suggestions,
            summary: {
                totalSuggestions: suggestions.length,
                highSeverity: suggestions.filter(s => s.severity === 'high').length,
                potentialImprovement: suggestions.length > 0 ? 'significant' : 'minimal'
            }
        })
    } catch (error: any) {
        logger.error('Workflow optimization failed:', error.message)
        return NextResponse.json({
            error: 'Failed to generate optimization suggestions'
        }, { status: 500 })
    }
}
