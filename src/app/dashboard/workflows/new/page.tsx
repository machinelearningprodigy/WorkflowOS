'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/utils/trpc'
import { useToast } from '@/components/ui/use-toast'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

export default function NewWorkflowPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [showDialog, setShowDialog] = useState(true)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [aiPrompt, setAiPrompt] = useState('')
    const [useAI, setUseAI] = useState(false)

    const createMutation = trpc.workflow.create.useMutation({
        onSuccess: (workflow) => {
            toast({ title: 'Workflow created!' })
            router.push(`/dashboard/workflows/${workflow.id}`)
        },
        onError: (err) => {
            toast({ title: 'Failed to create', description: err.message, variant: 'destructive' })
        },
    })

    const generateMutation = trpc.workflow.generateFromPrompt.useMutation()

    const handleCreate = async () => {
        if (useAI) {
            if (!aiPrompt.trim()) {
                toast({ title: 'Prompt required', description: 'Please describe your workflow', variant: 'destructive' })
                return
            }

            try {
                // 1. Generate nodes from AI
                const generated = await generateMutation.mutateAsync({ prompt: aiPrompt })

                // 2. Create workflow with generated definition
                createMutation.mutate({
                    name: 'AI Generated Workflow', // Could extract from prompt or ask user
                    description: aiPrompt,
                    definition: {
                        nodes: generated.nodes,
                        edges: generated.edges,
                    },
                })
            } catch (err: any) {
                toast({ title: 'Generation failed', description: err.message, variant: 'destructive' })
            }
        } else {
            if (!name.trim()) {
                toast({ title: 'Name required', description: 'Please enter a workflow name', variant: 'destructive' })
                return
            }

            createMutation.mutate({
                name,
                description,
                definition: {
                    nodes: [],
                    edges: [],
                },
            })
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                {/* ... existing dialog content ... */}
                <DialogContent className="sm:max-w-2xl rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            Create New Workflow
                        </DialogTitle>
                        <DialogDescription>
                            Build powerful automations with AI assistance or start from scratch
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
                        {/* AI Toggle */}
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                            <input
                                type="checkbox"
                                id="use-ai"
                                checked={useAI}
                                onChange={(e) => setUseAI(e.target.checked)}
                                className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="use-ai" className="flex-1 cursor-pointer">
                                <div className="font-semibold text-indigo-900">Use AI Generation</div>
                                <div className="text-sm text-indigo-600">Describe what you want and let AI build it</div>
                            </label>
                        </div>

                        {useAI ? (
                            <div className="space-y-2">
                                <Label htmlFor="ai-prompt" className="text-sm font-semibold">
                                    Describe Your Workflow
                                </Label>
                                <Textarea
                                    id="ai-prompt"
                                    placeholder="e.g., Send me an email when someone fills out my form, then add their info to a Google Sheet"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    className="min-h-[120px] rounded-xl resize-none"
                                />
                                <p className="text-xs text-slate-500">
                                    Mention integrations like Gmail, Slack, Calendar, YouTube, Gemini, etc.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-semibold">
                                        Workflow Name
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="My Automation"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-semibold">
                                        Description (Optional)
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="What does this workflow do?"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="rounded-xl resize-none"
                                        rows={3}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <Link href="/dashboard/workflows">
                            <Button variant="outline" className="rounded-xl">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            onClick={handleCreate}
                            disabled={createMutation.isLoading || generateMutation.isLoading || (!useAI && !name.trim()) || (useAI && !aiPrompt.trim())}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl px-8"
                        >
                            {createMutation.isLoading || generateMutation.isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {generateMutation.isLoading ? 'Generating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Create Workflow
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
