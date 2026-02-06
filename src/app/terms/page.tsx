'use client'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 border-b pb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Terms of Service</h1>
                    <p className="text-slate-500 font-medium">Agreement Updated: February 5, 2026</p>
                </div>

                <div className="prose prose-slate max-w-none space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">1. Acceptance of Terms</h2>
                        <p className="text-slate-600 leading-relaxed">
                            By accessing or using the WorkflowOS platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">2. Use License</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Permission is granted to temporarily use the services provided on WorkflowOS for personal or commercial use. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>Attempt to decompile or reverse engineer any software contained on WorkflowOS.</li>
                            <li>Use our platform to build a competing product or service.</li>
                            <li>Remove any copyright or other proprietary notations from the materials.</li>
                            <li>Use the platform for any illegal or unauthorized purpose.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">3. Subscription & Payments</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Certain aspects of the Service may be provided for a fee or other charge. If you elect to use paid aspects of the Service, you agree to the pricing and payment terms, as we may update them from time to time.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">4. Limitation of Liability</h2>
                        <p className="text-slate-600 leading-relaxed">
                            In no event shall WorkflowOS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on WorkflowOS.
                        </p>
                    </section>

                    <section className="space-y-8 pt-8 border-t">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Legal Contact</h3>
                            <p className="text-slate-600 mt-2">Questions regarding these terms should be sent to:</p>
                            <div className="mt-4 p-6 bg-indigo-50 rounded-2xl">
                                <p className="font-semibold text-indigo-900">Email: legal@workflowos.ai</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
