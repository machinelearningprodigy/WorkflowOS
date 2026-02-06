'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-16 lg:grid-cols-2">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                                Let's talk about your <span className="text-indigo-600">automation needs.</span>
                            </h1>
                            <p className="mt-4 text-xl text-slate-600">
                                Have questions about our Pro or Enterprise plans? Our team is ready to help you scale your workflows.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Mail className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900">Email Us</div>
                                    <div className="text-slate-600">support@workflowos.ai</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center shrink-0">
                                    <MessageSquare className="h-5 w-5 text-pink-600" />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900">Live Chat</div>
                                    <div className="text-slate-600">Available Mon-Fri, 9am - 6pm EST</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-10 w-10 bg-cyan-100 rounded-lg flex items-center justify-center shrink-0">
                                    <MapPin className="h-5 w-5 text-cyan-600" />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900">Headquarters</div>
                                    <div className="text-slate-600">123 Automation Way, San Francisco, CA</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card className="shadow-xl border-slate-200">
                        <CardContent className="p-8">
                            <form className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">First Name</label>
                                        <Input placeholder="Jane" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Last Name</label>
                                        <Input placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Work Email</label>
                                    <Input placeholder="jane@company.com" type="email" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Subject</label>
                                    <Input placeholder="Enterprise Plan Inquiry" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Message</label>
                                    <Textarea placeholder="Tell us more about how we can help..." className="min-h-[150px]" />
                                </div>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg">
                                    Send Message
                                </Button>
                                <p className="text-center text-xs text-slate-500">
                                    By submitting this form, you agree to our privacy policy.
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
