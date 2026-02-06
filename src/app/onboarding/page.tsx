'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight, Zap, Target, Users } from "lucide-react"
import Link from "next/link"

export default function OnboardingPage() {
    const [step, setStep] = useState(1)

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-xl w-full space-y-8">
                {/* Logo & Progress */}
                <div className="text-center space-y-2">
                    <div className="h-12 w-12 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
                        <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`h-1.5 w-12 rounded-full transition-colors ${i <= step ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                        ))}
                    </div>
                </div>

                <Card className="border-slate-200 shadow-2xl rounded-[2rem] overflow-hidden">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CardHeader className="pt-10 px-10 text-center">
                                <CardTitle className="text-3xl font-bold">Welcome to WorkflowOS</CardTitle>
                                <p className="text-slate-500">Let's set up your organization to get started.</p>
                            </CardHeader>
                            <CardContent className="p-10 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Organization Name</label>
                                    <Input placeholder="Acme Corp" className="h-12 border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Your Role</label>
                                    <select className="w-full h-12 px-4 border rounded-xl appearance-none bg-white border-slate-200">
                                        <option>Engineer</option>
                                        <option>Product Manager</option>
                                        <option>Founder / Owner</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </CardContent>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <CardHeader className="pt-10 px-10 text-center">
                                <CardTitle className="text-3xl font-bold">What's your goal?</CardTitle>
                                <p className="text-slate-500">We'll tailor your experience based on your needs.</p>
                            </CardHeader>
                            <CardContent className="p-10 grid gap-4">
                                {[
                                    { title: "Connect internal tools", icon: Target, desc: "Sync data across your existing stack." },
                                    { title: "Build customer-facing flows", icon: Users, desc: "Automate user interactions." },
                                    { title: "Automate data processing", icon: Zap, desc: "Handle high-volume data events." },
                                ].map((goal, i) => (
                                    <div key={i} className="flex gap-4 p-4 border rounded-2xl cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition-all group">
                                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white">
                                            <goal.icon className="h-5 w-5 text-slate-600 group-hover:text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{goal.title}</div>
                                            <div className="text-xs text-slate-500">{goal.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
                            <CardHeader className="pt-10 px-10">
                                <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center mb-6">
                                    <Check className="h-10 w-10" />
                                </div>
                                <CardTitle className="text-3xl font-bold">You're all set!</CardTitle>
                                <p className="text-slate-500">Your organization is ready. Jump into the dashboard to build your first workflow.</p>
                            </CardHeader>
                            <CardContent className="p-10">
                                <Link href="/dashboard">
                                    <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-lg rounded-2xl font-bold">
                                        Launch Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </div>
                    )}

                    {step < 3 && (
                        <CardFooter className="p-10 pt-0 bg-slate-50/50 flex justify-between">
                            {step > 1 ? (
                                <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
                            ) : <div></div>}
                            <Button className="bg-indigo-600 hover:bg-indigo-700 px-8 rounded-xl font-bold" onClick={() => setStep(step + 1)}>
                                Continue
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    )
}
