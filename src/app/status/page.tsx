'use client'

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Clock, Zap } from "lucide-react"

const systems = [
    { name: "API & Backend", status: "Operational", lastIncident: "None" },
    { name: "Workflow Engine", status: "Operational", lastIncident: "None" },
    { name: "Web Dashboard", status: "Operational", lastIncident: "None" },
    { name: "Third-party Connectors", status: "Degraded Performance", lastIncident: "Stripe API latency" },
    { name: "Task Webhooks", status: "Operational", lastIncident: "None" },
]

export default function StatusPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl p-8 border shadow-sm mb-12">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">All Systems Operational</h1>
                                <p className="text-slate-500">Updated Feb 5, 2026 - 17:30 UTC</p>
                            </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 px-4 py-2">99.98% Uptime</Badge>
                    </div>
                </div>

                <div className="space-y-4 mb-12">
                    <h2 className="text-lg font-bold text-slate-900 px-2">Current System Status</h2>
                    <div className="bg-white rounded-3xl border shadow-sm divide-y">
                        {systems.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-6">
                                <div className="font-medium text-slate-700">{s.name}</div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-semibold ${s.status === 'Operational' ? 'text-green-600' : 'text-amber-600'}`}>
                                        {s.status}
                                    </span>
                                    <div className={`h-2 w-2 rounded-full ${s.status === 'Operational' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 px-2">Past Incidents</h2>
                    <div className="space-y-4">
                        {[
                            { date: "Feb 01", title: "Minor API Latency", content: "We observed increased latency in our primary API region. Resolved within 15 minutes." },
                            { date: "Jan 12", title: "Scheduled Maintenance", content: "Database upgrade completed successfully with minimal downtime." }
                        ].map((incident, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-slate-200" />
                                <div className="text-sm font-bold text-slate-400 mb-1">{incident.date}</div>
                                <h3 className="font-bold text-slate-900 mb-2">{incident.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{incident.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 text-center text-slate-500 text-sm">
                    Powered by WorkflowOS Status Engine
                </div>
            </div>
        </div>
    )
}
