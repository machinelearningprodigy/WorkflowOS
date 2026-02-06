'use client'

import { Badge } from "@/components/ui/badge"
import { Zap, Shield, Database, Layout, RefreshCw, Cpu, Code, Globe, MessageSquare } from "lucide-react"

const features = [
    {
        title: "Visual Workflow Editor",
        description: "Build complex logic with our powerful drag-and-drop interface. No coding required.",
        icon: Layout,
        color: "bg-blue-100 text-blue-600"
    },
    {
        title: "200+ Integrations",
        description: "Connect to the apps you use every day, from Slack and Gmail to Stripe and Salesforce.",
        icon: Globe,
        color: "bg-indigo-100 text-indigo-600"
    },
    {
        title: "Real-time Triggers",
        description: "React instantly to events. We support webhooks, polling, and scheduled executions.",
        icon: Zap,
        color: "bg-yellow-100 text-yellow-600"
    },
    {
        title: "Smart Conditional Logic",
        description: "Branch your workflows based on complex data conditions and filters with ease.",
        icon: Cpu,
        color: "bg-purple-100 text-purple-600"
    },
    {
        title: "Advanced Data Mapping",
        description: "Transform and map data between different applications using our intuitive mapper.",
        icon: Database,
        color: "bg-green-100 text-green-600"
    },
    {
        title: "Enterprise Security",
        description: "Bank-level encryption, SOC2 compliance, and SSO for your piece of mind.",
        icon: Shield,
        color: "bg-slate-100 text-slate-800"
    }
]

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="pt-24 pb-16 bg-slate-50 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <Badge variant="outline" className="text-indigo-600 border-indigo-200">System Capabilities</Badge>
                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight sm:text-6xl max-w-4xl mx-auto">
                        Powerful features for <br />
                        <span className="text-indigo-600">modern automation teams.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-600">
                        Everything you need to automate your entire business logic in one intuitive platform.
                    </p>
                </div>
            </div>

            {/* Feature Grid */}
            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => (
                        <div key={i} className="group p-8 border rounded-3xl hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feature.color}`}>
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Comparison or Callout */}
            <div className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 space-y-8">
                            <h2 className="text-4xl font-bold">Built for developers, <br />loved by business teams.</h2>
                            <p className="text-slate-400 text-lg">
                                Whether you prefer point-and-click or writing custom scripts, WorkflowOS has you covered. Extend any workflow with our custom JS code blocks.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                    </div>
                                    <span className="font-medium text-slate-200">Custom JS & Python support</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                    </div>
                                    <span className="font-medium text-slate-200">Full API & SDK access</span>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
                            <pre className="text-sm font-mono text-indigo-400">
                                <code>{`// Custom logic in WorkflowOS
async function transform(data) {
  const users = data.results;
  return users.map(user => ({
    id: user.uuid,
    name: \`\${user.first} \${user.last}\`,
    status: 'ACTIVE'
  }));
}`}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
