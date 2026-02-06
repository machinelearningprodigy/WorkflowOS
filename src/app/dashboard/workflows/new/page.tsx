"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bot, Sparkles, ArrowRight, LayoutTemplate, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { trpc } from "@/utils/trpc"
import { useToast } from "@/components/ui/use-toast"

export default function NewWorkflowPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [prompt, setPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

    // Mutation to create a workflow (Manual)
    const createMutation = trpc.workflow.create.useMutation({
        onSuccess: (data) => {
            toast({ title: "Workflow created successfully" })
            router.push(`/dashboard/workflows/${data.id}`)
        },
        onError: (error) => {
            toast({
                title: "Error creating workflow",
                description: error.message,
                variant: "destructive"
            })
        }
    })

    // Mutation to generate workflow via AI
    const generateMutation = trpc.ai.generateWorkflow.useMutation({
        onSuccess: (data) => {
            setIsGenerating(false)
            toast({ title: "AI Magic Complete ✨", description: "Your workflow is ready!" })
            router.push(`/dashboard/workflows/${data.id}`)
        },
        onError: (error) => {
            setIsGenerating(false)
            toast({
                title: "AI Generation Failed",
                description: error.message,
                variant: "destructive"
            })
        }
    })

    const handleGenerate = async () => {
        if (!prompt.trim()) return

        setIsGenerating(true)
        generateMutation.mutate({ description: prompt })
    }

    const handleStartScratch = () => {
        createMutation.mutate({
            name: "Untitled Workflow",
            description: "New workflow started from scratch",
            definition: {
                nodes: [
                    {
                        id: 'trigger-1',
                        type: 'default',
                        position: { x: 250, y: 50 },
                        data: { label: 'Manual Trigger', provider: 'Manual' }
                    }
                ],
                edges: []
            }
        })
    }

    return (
        <div className="container mx-auto py-10 max-w-5xl">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    Create New Workflow
                </h1>
                <p className="text-xl text-muted-foreground">
                    Start automating your tasks in seconds. Choose how you want to build.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* AI Generator Option */}
                <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all shadow-lg hover:shadow-xl bg-gradient-to-br from-background to-primary/5">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="flex items-center gap-2">
                            Generate with AI
                            <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">Beta</Badge>
                        </CardTitle>
                        <CardDescription>
                            Describe what you want to achieve, and we'll build the workflow for you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Label htmlFor="prompt">Describe your workflow</Label>
                            <Textarea
                                id="prompt"
                                placeholder="e.g. When a new row is added to Google Sheets, send a Slack message and create a Jira ticket."
                                className="min-h-[120px] resize-none bg-background/50"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            size="lg"
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt.trim() || generateMutation.isLoading}
                        >
                            {isGenerating || generateMutation.isLoading ? (
                                <>
                                    <Bot className="mr-2 h-4 w-4 animate-bounce" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate Magic Workflow
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    {/* Start from Scratch */}
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={handleStartScratch}>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-lg">Start from Scratch</CardTitle>
                                <CardDescription>Build your workflow manually using the visual editor.</CardDescription>
                            </div>
                            {createMutation.isLoading ? (
                                <Bot className="ml-auto w-5 h-5 animate-spin text-primary" />
                            ) : (
                                <ArrowRight className="ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            )}
                        </CardHeader>
                    </Card>

                    {/* Use Template */}
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => router.push("/dashboard/templates")}>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <LayoutTemplate className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-lg">Browse Templates</CardTitle>
                                <CardDescription>Choose from 50+ pre-built automation recipes.</CardDescription>
                            </div>
                            <ArrowRight className="ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    )
}
