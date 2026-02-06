'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Zap, Globe, Mail, MessageSquare, Database, CreditCard } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

const apps: Record<string, any> = {
    gmail: { name: "Gmail", icon: Mail, color: "bg-red-50 text-red-600", desc: "Connect your email workflow with WorkflowOS to automate sending, receiving, and managing emails." },
    slack: { name: "Slack", icon: MessageSquare, color: "bg-purple-50 text-purple-600", desc: "Automate your team communication by sending messages, creating channels, and responding to events in Slack." },
    stripe: { name: "Stripe", icon: CreditCard, color: "bg-indigo-50 text-indigo-600", desc: "Synchronize your payments, customers, and subscriptions with other business tools instantly." },
}

export default function IntegrationDetailPage() {
    const params = useParams()
    const id = params.id as string
    const app = apps[id] || { name: id.charAt(0).toUpperCase() + id.slice(1), icon: Globe, color: "bg-slate-50 text-slate-600", desc: "Integrate this application via WorkflowOS to automate your business processes." }

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 pb-12 bg-slate-50 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/integrations" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Integrations
                    </Link>

                    <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className={`h-24 w-24 rounded-3xl flex items-center justify-center shrink-0 border ${app.color}`}>
                            <app.icon className="h-12 w-12" />
                        </div>
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-4 flex-wrap">
                                <h1 className="text-4xl font-extrabold text-slate-900">{app.name}</h1>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">Verified Integration</Badge>
                            </div>
                            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                                {app.desc}
                            </p>
                            <div className="flex gap-4 pt-4">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8">Connect {app.name}</Button>
                                <Button variant="outline" className="h-12 px-8">View Documentation</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-16 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-12">
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold">Popular Use Cases</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    `Send ${app.name} notifications for new Shopify orders.`,
                                    `Sync data from ${app.name} to your internal CRM.`,
                                    `Trigger workflows when an event occurs in ${app.name}.`,
                                    `Update ${app.name} records from Typeform submissions.`
                                ].map((useCase, i) => (
                                    <div key={i} className="p-4 border rounded-2xl flex items-start gap-3 hover:border-indigo-500 transition-colors">
                                        <div className="h-6 w-6 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="h-3 w-3 text-indigo-600" />
                                        </div>
                                        <p className="text-slate-600 text-sm">{useCase}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold">Supported Actions & Triggers</h2>
                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" /> Triggers</h3>
                                    <ul className="space-y-2 text-slate-600">
                                        <li>• New Item Created</li>
                                        <li>• Existing Item Updated</li>
                                        <li>• Item Deleted</li>
                                        <li>• Watch Specific Folder</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-2"><Zap className="h-4 w-4 text-indigo-500" /> Actions</h3>
                                    <ul className="space-y-2 text-slate-600">
                                        <li>• Create Custom Object</li>
                                        <li>• Update Record Entry</li>
                                        <li>• Send Notification</li>
                                        <li>• Search for Records</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <div className="p-8 border rounded-3xl bg-slate-50 space-y-6">
                            <h3 className="font-bold">Integration Details</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Developer</span>
                                    <span className="font-medium">WorkflowOS Team</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Last Updated</span>
                                    <span className="font-medium">Feb 01, 2026</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Category</span>
                                    <span className="font-medium">Productivity</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border rounded-3xl bg-indigo-600 text-white space-y-4">
                            <h3 className="font-bold">Ready to automate?</h3>
                            <p className="text-indigo-100 text-sm">Join 50,000+ businesses and start connecting your favorite tools today.</p>
                            <Button className="w-full bg-white text-indigo-600 hover:bg-slate-100">Get Started Free</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
