'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap } from "lucide-react"
import Link from "next/link"

const plans = [
    {
        name: "Starter",
        price: "0",
        description: "Perfect for exploring automation",
        features: ["1,000 tasks/month", "5 active workflows", "Standard integrations", "15-min check interval"],
        buttonText: "Start for Free",
        popular: false
    },
    {
        name: "Pro",
        price: "49",
        description: "Best for growing businesses",
        features: ["50,000 tasks/month", "Unlimited workflows", "Premium integrations", "1-min check interval", "Priority support", "Custom webhooks"],
        buttonText: "Get Started",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large-scale operations",
        features: ["Unlimited tasks", "SSO & SAML", "Dedicated account manager", "SLA guarantees", "Custom security audits", "On-premise option"],
        buttonText: "Contact Sales",
        popular: false
    }
]

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">Simple Pricing</Badge>
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                        Scale your workflow without limits
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-600">
                        Choose the plan that's right for your team. All plans include core automation features.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {plans.map((plan, i) => (
                        <div key={i} className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col ${plan.popular ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200'}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                                <p className="mt-2 text-slate-500 text-sm">{plan.description}</p>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-4xl font-bold text-slate-900">
                                        {plan.price === 'Custom' ? '' : '$'}
                                        {plan.price}
                                    </span>
                                    {plan.price !== 'Custom' && <span className="ml-1 text-slate-500">/mo</span>}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-3 text-sm text-slate-600">
                                        <Check className="h-4 w-4 text-indigo-500 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href={plan.price === 'Custom' ? '/contact' : '/sign-up'} className="mt-auto">
                                <Button className={`w-full py-6 rounded-xl text-lg transition-all ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-slate-800'}`}>
                                    {plan.buttonText}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-24 p-8 bg-slate-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Still have questions?</h2>
                        <p className="text-slate-400">Our team is here to help you find the perfect setup for your needs.</p>
                    </div>
                    <Link href="/contact">
                        <Button variant="outline" className="bg-transparent border-white/20 hover:bg-white/10 text-white px-8 py-6 rounded-xl">
                            Talk to Support
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
