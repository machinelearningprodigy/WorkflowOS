'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, Users, Server, FileCheck, LifeBuoy, Fingerprint, Lock } from "lucide-react"
import Link from "next/link"

const enterpriseFeatures = [
    {
        title: "Advanced SSO & SAML",
        description: "Integrate with Okta, Azure AD, and Ping Identity for secure, centralized access management.",
        icon: Fingerprint
    },
    {
        title: "Role-Based Access Control",
        description: "Granular permissions for teams, projects, and individual workflows to maintain least-privilege.",
        icon: Users
    },
    {
        title: "Dedicated Support & SLA",
        description: "24/7 priority support with guaranteed uptime SLAs and a dedicated account manager.",
        icon: LifeBuoy
    },
    {
        title: "Security & Compliance",
        description: "SOC2 Type II, GDPR, and HIPAA compliant. Automated audit logs for all account activity.",
        icon: FileCheck
    }
]

export default function EnterprisePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Dark Hero Section */}
            <div className="bg-slate-900 text-white pt-32 pb-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_50%,#4f46e5,transparent)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <Badge variant="outline" className="text-indigo-400 border-indigo-400/30 mb-6">WorkflowOS For Enterprise</Badge>
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-8">
                        Scale with confidence. <br />
                        <span className="text-indigo-500">Secure by design.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-12">
                        Enterprises trust WorkflowOS to run their most critical business processes at scale. We provide the security, governance, and support your organization demands.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/contact">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 h-14 px-10 text-lg">Contact Enterprise Sales</Button>
                        </Link>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-10 text-lg">Download Security Overview</Button>
                    </div>
                </div>
            </div>

            {/* Enterprise Grid */}
            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2">
                    {enterpriseFeatures.map((feature, i) => (
                        <div key={i} className="flex gap-6 p-10 border rounded-3xl bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5 transition-all">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0">
                                <feature.icon className="h-7 w-7 text-white" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-slate-900">{feature.title}</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security Section */}
            <div className="py-24 border-t bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="lg:w-1/2 space-y-6">
                            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <Lock className="h-6 w-6 text-green-600" />
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900">Your data, <br />always protected.</h2>
                            <p className="text-xl text-slate-600">
                                We utilize end-to-end encryption for all sensitive data. Your credentials never touch our databases in plain text.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-400 grayscale opacity-50">SOC2 CERTIFIED</div>
                                <div className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-400 grayscale opacity-50">ISO 27001</div>
                                <div className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-400 grayscale opacity-50">GDPR COMPLIANT</div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-xl">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Request Enterprise Demo</h3>
                                <form className="space-y-4">
                                    <input className="w-full h-12 px-4 border rounded-xl" placeholder="Full Name" />
                                    <input className="w-full h-12 px-4 border rounded-xl" placeholder="Work Email" type="email" />
                                    <select className="w-full h-12 px-4 border rounded-xl appearance-none bg-white">
                                        <option>Select Company Size</option>
                                        <option>500 - 1,000 employees</option>
                                        <option>1,000 - 5,000 employees</option>
                                        <option>5,000+ employees</option>
                                    </select>
                                    <Button className="w-full bg-slate-900 hover:bg-slate-800 h-12">Submit Request</Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
