'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Play, Zap, Layout, Globe, ArrowRight } from "lucide-react"
import Link from "next/link"

const steps = [
    { title: "Create an Account", desc: "Sign up for a free WorkflowOS account to get started immediately." },
    { title: "Pick a Template", desc: "Choose from our library of pre-built workflows or start from scratch." },
    { title: "Connect your Apps", desc: "Authorize your accounts (like Slack, Gmail, or Stripe) to let WorkflowOS talk to them." },
    { title: "Activate & Monitor", desc: "Turn your workflow on and watch it handle tasks in real-time." },
]

export default function GettingStartedDocsPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 pb-12 bg-slate-50 border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/docs" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Docs
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Getting Started</h1>
                    <p className="text-xl text-slate-600">Build your first automation in less than 5 minutes.</p>
                </div>
            </div>

            <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="prose prose-slate prose-lg max-w-none">
                    <p>
                        Welcome to the WorkflowOS documentation! This guide will walk you through the core concepts of the platform and help you set up your first automation.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-8">Four steps to automation bliss</h2>

                    <div className="not-prose space-y-4 mb-12">
                        {steps.map((step, i) => (
                            <div key={i} className="flex gap-6 p-6 border rounded-3xl bg-white hover:border-indigo-500 transition-colors group">
                                <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {i + 1}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-900">{step.title}</h3>
                                    <p className="text-slate-600 text-sm">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Key Terminology</h2>
                    <div className="not-prose grid gap-6 sm:grid-cols-2">
                        <div className="p-6 bg-slate-50 rounded-3xl border">
                            <h3 className="font-bold flex items-center gap-2 mb-2"><Zap className="h-4 w-4 text-amber-500" /> Triggers</h3>
                            <p className="text-sm text-slate-600">The event that starts your workflow. This could be a new email, a scheduled time, or a webhook call.</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border">
                            <h3 className="font-bold flex items-center gap-2 mb-2"><Play className="h-4 w-4 text-indigo-500" /> Actions</h3>
                            <p className="text-sm text-slate-600">The work that WorkflowOS does for you. Each action represents one step in your process.</p>
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-[2.5rem] p-10 mt-16 text-white not-prose">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-4 text-center md:text-left">
                                <h3 className="text-2xl font-bold">Ready to build?</h3>
                                <p className="text-indigo-100 max-w-sm">Jump straight into the dashboard and create your first automation today.</p>
                            </div>
                            <Link href="/dashboard">
                                <Button className="bg-white text-indigo-600 hover:bg-slate-100 h-14 px-10 text-lg rounded-2xl font-bold shadow-xl">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
