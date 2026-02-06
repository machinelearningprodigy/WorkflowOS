'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function BlogPostPage() {
    const params = useParams()
    const slug = params.slug as string
    const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 pb-12 border-b">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/blog" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                    </Link>

                    <div className="space-y-6">
                        <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-50 border-0">Insights & Strategy</Badge>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl lg:text-6xl">
                            {title}
                        </h1>
                        <div className="flex items-center justify-between py-6 border-y">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-200" />
                                <div>
                                    <div className="font-bold text-slate-900">Alex Rivers</div>
                                    <div className="text-xs text-slate-500">Head of Product @ WorkflowOS</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
                                <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Feb 05, 2026</div>
                                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> 12 min read</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <article className="prose prose-slate prose-lg lg:prose-xl max-w-none text-slate-600 space-y-8">
                    <p className="lead text-xl text-slate-900 font-medium italic">
                        In the rapidly evolving world of technology, automation is no longer just a luxury—it's a fundamental requirement for any business looking to scale in 2026.
                    </p>

                    <h2 className="text-3xl font-bold text-slate-900">The Rise of Agentic Automation</h2>
                    <p>
                        We're moving beyond simple "If This Then That" logic. Modern automation platforms are becoming more aware of the context they operate in. At WorkflowOS, we're building systems that can reason about the data they process.
                    </p>

                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 not-prose my-12">
                        <h3 className="font-bold text-slate-900 mb-4">Key Takeaways</h3>
                        <ul className="space-y-3 text-slate-700">
                            <li className="flex gap-3">
                                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                <span>Automation will shift from execution-focused to intent-focused systems.</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                <span>Low-code platforms are empowering non-technical teams more than ever.</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                <span>Security and compliance remain the top concerns for enterprise adopters.</span>
                            </li>
                        </ul>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900">Why Architecture Matters</h2>
                    <p>
                        When building workflows that handle millions of events per day, the underlying architecture becomes the bottleneck. We've optimized our engine to handle spikes in traffic while maintaining sub-second latency for most operations.
                    </p>

                    <p>
                        Stay tuned for our next update where we'll dive deeper into our new Python scripting environment.
                    </p>
                </article>

                <div className="mt-20 pt-10 border-t flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-sm font-bold text-slate-900 uppercase tracking-widest">Share this article</div>
                    <div className="flex gap-4">
                        <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-200 hover:bg-slate-50">
                            <Twitter className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-200 hover:bg-slate-50">
                            <Linkedin className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-200 hover:bg-slate-50">
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
