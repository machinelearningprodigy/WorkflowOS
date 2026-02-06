"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"

const plans = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for exploring logic.",
        features: ["1,000 executions", "5 workflows", "Community support"]
    },
    {
        name: "Pro",
        price: "$49",
        description: "Powering your growth.",
        features: ["10,000 executions", "Unlimited workflows", "24h Priority support", "Advanced Analytics"],
        popular: true
    },
    {
        name: "Team",
        price: "$149",
        description: "Automation for organizations.",
        features: ["50,000 executions", "Team collaboration", "Shared credentials", "Audit logs"]
    }
]

export function PricingCards() {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
                <Card key={plan.name} className={`relative border-slate-200 rounded-[2rem] overflow-hidden ${plan.popular ? 'border-2 border-indigo-600 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50 animate-in zoom-in duration-500' : ''}`}>
                    {plan.popular && (
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Most Popular
                        </div>
                    )}
                    <CardHeader className="pt-8 px-8 pb-4">
                        <CardTitle className="text-2xl font-black text-slate-900">{plan.name}</CardTitle>
                        <div className="flex items-baseline gap-1 my-4">
                            <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                            <span className="text-slate-400 font-medium">/month</span>
                        </div>
                        <CardDescription className="font-medium text-slate-500">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-4">
                        <div className="h-px bg-slate-100 w-full mb-6" />
                        {plan.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                    <Check className="h-3 w-3" />
                                </div>
                                {feature}
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="px-8 pb-8">
                        <Button className={`w-full h-12 rounded-xl text-sm font-bold transition-all ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-slate-900 hover:bg-slate-800'}`}>
                            {plan.name === 'Starter' ? 'Get Started' : 'Switch to ' + plan.name}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
