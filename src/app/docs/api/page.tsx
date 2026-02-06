'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Code, Copy, Globe, Terminal } from "lucide-react"
import Link from "next/link"

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 pb-12 bg-slate-50 border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/docs" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Docs
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <h1 className="text-4xl font-extrabold text-slate-900">API Reference</h1>
                        <Badge className="bg-slate-900">v1.0</Badge>
                    </div>
                    <p className="text-xl text-slate-600">Integrate WorkflowOS directly into your applications.</p>
                </div>
            </div>

            <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-16">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><Globe className="h-5 w-5 text-indigo-600" /> Authentication</h2>
                        <p className="text-slate-600">All API requests must include your API key in the <code>Authorization</code> header. You can manage your keys in the <Link href="/dashboard/api-keys" className="text-indigo-600 underline">Dashboard</Link>.</p>

                        <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm overflow-hidden relative group">
                            <Button variant="ghost" size="icon" className="absolute right-4 top-4 text-slate-400 hover:text-white">
                                <Copy className="h-4 w-4" />
                            </Button>
                            <pre className="text-indigo-400">
                                <code>curl -H "Authorization: Bearer YOUR_API_KEY" \
                                    https://api.workflowos.ai/v1/workflows</code>
                            </pre>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><Terminal className="h-5 w-5 text-indigo-600" /> List Workflows</h2>
                        <p className="text-slate-600">Retrieve a list of all active workflows in your organization.</p>
                        <div className="flex items-center gap-4 text-sm font-bold">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">GET</Badge>
                            <code className="text-slate-900">/v1/workflows</code>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Parameters</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between border-b pb-2 text-sm">
                                        <code className="font-bold text-indigo-600">status</code>
                                        <span className="text-slate-500 italic">optional</span>
                                    </div>
                                    <p className="text-xs text-slate-500">Filter by 'active' or 'paused'.</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 border rounded-2xl p-6">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Response</h3>
                                <pre className="text-xs font-mono text-slate-700">
                                    <code>{`{
  "data": [
    {
      "id": "wf_123",
      "name": "Slack Sync",
      "status": "active"
    }
  ]
}`}</code>
                                </pre>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
