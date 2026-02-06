'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Book, Code, Zap, Shield, Rocket, ArrowRight } from "lucide-react"
import Link from "next/link"

const sections = [
    { title: "Getting Started", icon: Rocket, desc: "Learn the basics of building your first workflow.", link: "/docs/getting-started" },
    { title: "API Reference", icon: Code, desc: "Detailed documentation for developers using our API.", link: "/docs/api" },
    { title: "Core Concepts", icon: Book, desc: "Understand triggers, actions, and data mapping.", link: "/docs/concepts" },
    { title: "Best Practices", icon: Zap, desc: "Optimize your workflows for performance and reliability.", link: "/docs/best-practices" },
]

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 pb-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-8">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
                        WorkflowOS <span className="text-indigo-400">Docs</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-400">
                        Everything you need to build, scale, and manage your automations like a pro.
                    </p>
                    <div className="max-w-xl mx-auto relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input className="w-full h-14 pl-12 pr-4 bg-slate-800 border-white/10 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600" placeholder="Search documentation..." />
                    </div>
                </div>
            </div>

            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-2">
                    {sections.map((section, i) => (
                        <Link href={section.link} key={i}>
                            <div className="p-8 border rounded-3xl hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group h-full flex flex-col items-start">
                                <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                                    <section.icon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{section.title}</h3>
                                <p className="text-slate-500 mb-6 flex-1">
                                    {section.desc}
                                </p>
                                <div className="text-indigo-600 font-semibold inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                    Explore <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-24 bg-slate-50 border rounded-[3rem] p-12 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <Shield className="h-5 w-5 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold">Need technical help?</h2>
                        </div>
                        <p className="text-slate-600 text-lg max-w-lg">Our engineering support team is available 24/7 for Pro and Enterprise customers.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="h-14 px-8 rounded-2xl">Visit Forum</Button>
                        <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800">Support Center</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
