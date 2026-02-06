'use client'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 border-b pb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
                    <p className="text-slate-500 font-medium">Last Updated: February 5, 2026</p>
                </div>

                <div className="prose prose-slate max-w-none space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">1. Introduction</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Welcome to WorkflowOS. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or use our platform.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">2. Data We Collect</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data:</strong> includes billing address, email address and telephone numbers.</li>
                            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                            <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">3. How We Use Your Data</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal or regulatory obligation.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">4. Data Security</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>
                    </section>

                    <section className="space-y-8 pt-8 border-t">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Contact Us</h3>
                            <p className="text-slate-600 mt-2">If you have any questions about this privacy policy, please contact us at:</p>
                            <div className="mt-4 p-6 bg-slate-50 rounded-2xl">
                                <p className="font-semibold">Email: privacy@workflowos.ai</p>
                                <p className="text-slate-500">Address: 123 Automation Way, San Francisco, CA 94103</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
