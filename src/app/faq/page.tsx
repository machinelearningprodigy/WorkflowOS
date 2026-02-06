'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const faqs = [
    {
        question: "What is WorkflowOS?",
        answer: "WorkflowOS is an automation platform that allows you to connect over 200+ applications and automate repetitive tasks without writing code. It use a powerful node-based editor to build complex workflows easily."
    },
    {
        question: "Is there a free trial?",
        answer: "Yes! We offer a Starter plan that is free forever and includes 1,000 tasks per month. No credit card is required to start."
    },
    {
        question: "How does the task-based pricing work?",
        answer: "A task is counted every time a workflow successfully performs an action (like sending an email or updating a database record). Triggers do not count as tasks."
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your billing dashboard. If you cancel, you'll still have access to your plan until the end of your current billing period."
    },
    {
        question: "Do you offer enterprise-grade security?",
        answer: "Yes, security is our top priority. We use industry-standard encryption, offer SSO/SAML for enterprise customers, and are fully SOC2 Type II compliant."
    }
]

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-white pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 space-y-4">
                <Badge variant="outline" className="text-indigo-600 border-indigo-200">Got Questions?</Badge>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
                    Common Questions
                </h1>
                <p className="text-xl text-slate-600">
                    Everything you need to know about WorkflowOS and how it works.
                </p>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border rounded-2xl px-6 py-2">
                            <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600 text-base leading-relaxed pt-2 pb-4">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <div className="mt-16 p-8 bg-indigo-50 rounded-3xl text-center space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Still have questions?</h2>
                    <p className="text-slate-600">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    <div className="pt-4">
                        <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
