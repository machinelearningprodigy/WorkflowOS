import Link from "next/link"
import { Zap, Github, Twitter, Linkedin, Mail } from "lucide-react"

const footerLinks = {
    Product: [
        { name: "Features", href: "/features" },
        { name: "Integrations", href: "/integrations" },
        { name: "Pricing", href: "/pricing" },
        { name: "Roadmap", href: "/roadmap" },
    ],
    Company: [
        { name: "About", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" },
    ],
    Support: [
        { name: "Documentation", href: "/docs" },
        { name: "API Reference", href: "/docs/api" },
        { name: "Systems Status", href: "/status" },
        { name: "FAQ", href: "/faq" },
    ],
    Legal: [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Cookies", href: "/cookies" },
    ],
}

export function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-100 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-24">
                    <div className="col-span-2 space-y-8">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900">WorkflowOS</span>
                        </Link>
                        <p className="max-w-xs text-sm text-slate-500 font-medium leading-relaxed">
                            The operating system for modern automation. Build, deploy, and scale logic without infrastructure headaches.
                        </p>
                        <div className="flex gap-4">
                            {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                                <button key={i} className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                                    <Icon className="h-4 w-4" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</h4>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        © 2026 WorkflowOS Technologies Inc. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/status" className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">All Systems Operational</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
