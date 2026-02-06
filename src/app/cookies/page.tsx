'use client'

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-white pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 border-b pb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Cookie Policy</h1>
                    <p className="text-slate-500 font-medium">Policy Updated: February 5, 2026</p>
                </div>

                <div className="prose prose-slate max-w-none space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">1. What are cookies?</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">2. How we use cookies</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We use cookies for several reasons:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li><strong>Essential cookies:</strong> These are necessary for the website to function and cannot be switched off in our systems.</li>
                            <li><strong>Performance cookies:</strong> These allow us to count visits and traffic sources so we can measure and improve the performance of our site.</li>
                            <li><strong>Functional cookies:</strong> These enable the website to provide enhanced functionality and personalization.</li>
                            <li><strong>Targeting cookies:</strong> These may be set through our site by our advertising partners to build a profile of your interests.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">3. Managing your preferences</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" className="text-indigo-600 underline">www.aboutcookies.org</a>.
                        </p>
                    </section>

                    <section className="space-y-8 pt-8 border-t">
                        <p className="text-slate-600">
                            By using our site, you consent to our use of cookies as described in this policy.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
