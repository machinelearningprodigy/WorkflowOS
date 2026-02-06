'use client'

import { Badge } from "@/components/ui/badge"
import { PlayCircle, Users, Zap, Globe, Heart } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative pt-24 pb-16 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-8">
                        <Badge variant="outline" className="text-indigo-600 border-indigo-200">Our Story</Badge>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight sm:text-6xl">
                            We're on a mission to <br />
                            <span className="text-indigo-600">automate the world.</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-slate-600">
                            WorkflowOS was built with a simple idea: that humans should spend their time being creative, not doing repetitive tasks.
                        </p>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-3">
                        <div className="space-y-4">
                            <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Zap className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Radical Speed</h3>
                            <p className="text-slate-600">We believe in shipping fast and iterating even faster. Automation shouldn't be slow.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 bg-pink-100 rounded-xl flex items-center justify-center">
                                <Heart className="h-6 w-6 text-pink-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Human Centric</h3>
                            <p className="text-slate-600">Technology should serve people. Our tools are designed to feel natural and intuitive.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                                <Globe className="h-6 w-6 text-cyan-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Open & Transparent</h3>
                            <p className="text-slate-600">We build in the open and value honest feedback from our community and customers.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-24 border-y">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-slate-900">
                        <div>
                            <div className="text-4xl font-bold">10M+</div>
                            <div className="text-sm text-slate-500 uppercase tracking-wider mt-1">Tasks Automated</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">50k+</div>
                            <div className="text-sm text-slate-500 uppercase tracking-wider mt-1">Active Users</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">200+</div>
                            <div className="text-sm text-slate-500 uppercase tracking-wider mt-1">Integrations</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">99.9%</div>
                            <div className="text-sm text-slate-500 uppercase tracking-wider mt-1">Uptime</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Meet our team</h2>
                        <p className="text-slate-600 mt-4">The people behind the pixels.</p>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="text-center space-y-4">
                                <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-300">
                                    <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                                        <Users className="h-12 w-12 text-indigo-300" />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold text-lg">Team Member {i}</div>
                                    <div className="text-sm text-indigo-600 font-medium font-mono uppercase">Role / Position</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
