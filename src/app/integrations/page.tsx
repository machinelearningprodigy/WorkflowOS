'use client'

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Grid, Mail, MessageSquare, Database, Globe, CreditCard } from "lucide-react"
import Link from "next/link"

const categories = ["All", "Communication", "Marketing", "Data & CRM", "Finance", "Dev Tools"]

const integrations = [
    { id: "gmail", name: "Gmail", desc: "Connect your email workflow.", category: "Communication", icon: Mail, color: "bg-red-50 text-red-600" },
    { id: "slack", name: "Slack", desc: "Automate your team chats.", category: "Communication", icon: MessageSquare, color: "bg-purple-50 text-purple-600" },
    { id: "stripe", name: "Stripe", desc: "Manage billing and payments.", category: "Finance", icon: CreditCard, color: "bg-indigo-50 text-indigo-600" },
    { id: "airtable", name: "Airtable", desc: "Sync your records effortlessly.", category: "Data & CRM", icon: Database, color: "bg-blue-50 text-blue-600" },
    { id: "webhook", name: "Webhooks", desc: "Connect any custom API.", category: "Dev Tools", icon: Globe, color: "bg-slate-50 text-slate-600" },
]

export default function IntegrationsPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">App Marketplace</Badge>
                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight sm:text-6xl">
                        Connect your <span className="text-indigo-600">tools.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-600">
                        Choose from over 200+ integrations to build your perfect automated workflow.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${cat === 'All' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input className="pl-10 h-12 rounded-xl bg-white focus:bg-white" placeholder="Search integrations..." />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {integrations.map((app) => (
                        <Link href={`/integrations/${app.id}`} key={app.id}>
                            <div className="bg-white p-8 rounded-3xl border shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all group h-full">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${app.color}`}>
                                    <app.icon className="h-7 w-7" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900">{app.name}</h3>
                                    <p className="text-slate-500 leading-relaxed text-sm">
                                        {app.desc}
                                    </p>
                                </div>
                                <div className="mt-6 flex items-center text-sm font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Details &rarr;
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-24 p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">Don't see your app?</h2>
                        <p className="text-slate-400 text-lg">Use our custom Webhook provider or HTTP request block to connect any app with an API.</p>
                    </div>
                    <Link href="/docs/api">
                        <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-colors whitespace-nowrap">
                            Learn more about Custom Integrations
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
