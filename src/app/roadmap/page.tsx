'use client'

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Zap, Rocket, Star, MessageSquare } from "lucide-react"

const roadmap = [
    {
        quarter: "Q1 2026",
        status: "In Progress",
        items: [
            { title: "Advanced Python Code Blocks", icon: Zap, priority: "High" },
            { title: "Universal Webhook Parser", icon: Rocket, priority: "Critical" },
            { title: "Multi-factor Auth (MFA)", icon: Star, priority: "High" }
        ]
    },
    {
        quarter: "Q2 2026",
        status: "Planned",
        items: [
            { title: "Workflow Templates Marketplace", icon: MessageSquare, priority: "Medium" },
            { title: "On-Premise Deployment", icon: Rocket, priority: "High" },
            { title: "Custom Integration Builder", icon: Zap, priority: "Medium" }
        ]
    },
    {
        quarter: "Q3 2026",
        status: "Under Consideration",
        items: [
            { title: "AI-Powered Workflow Generation", icon: Star, priority: "Medium" },
            { title: "Mobile App (iOS/Android)", icon: Rocket, priority: "Low" }
        ]
    }
]

export default function RoadmapPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 mb-20">
                <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">Our Vision</Badge>
                <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight sm:text-6xl">
                    Product Roadmap
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-slate-600">
                    See what we're working on and what's coming next to WorkflowOS. Your feedback shapes our journey.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {roadmap.map((phase, i) => (
                        <div key={i} className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-2xl font-bold text-slate-900">{phase.quarter}</h2>
                                <Badge variant={phase.status === 'In Progress' ? 'default' : 'outline'}
                                    className={phase.status === 'In Progress' ? 'bg-indigo-600' : 'bg-white'}>
                                    {phase.status}
                                </Badge>
                            </div>

                            <div className="space-y-4">
                                {phase.items.map((item, j) => (
                                    <div key={j} className="bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                                <item.icon className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
                                            </div>
                                            <div className="space-y-1 flex-1">
                                                <h3 className="font-bold text-slate-900">{item.title}</h3>
                                                <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-0 text-[10px] uppercase font-bold tracking-wider">
                                                    {item.priority}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 p-12 bg-indigo-600 rounded-[3rem] text-white overflow-hidden relative">
                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        <h2 className="text-3xl font-bold">Have a feature request?</h2>
                        <p className="text-indigo-100 text-lg max-w-xl">
                            We build for you. If there's something you'd love to see in WorkflowOS, let us know on our community forum.
                        </p>
                        <Button className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 rounded-xl font-bold">
                            Submit Feedback
                        </Button>
                    </div>
                    {/* Abstract background blobs */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    )
}
