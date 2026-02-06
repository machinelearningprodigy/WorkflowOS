"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, Menu, X, Rocket, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
    { name: "Features", href: "/features" },
    { name: "Integrations", href: "/integrations" },
    { name: "Pricing", href: "/pricing" },
    { name: "Docs", href: "/docs" },
]

export function Navbar() {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900">WorkflowOS</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-bold transition-colors hover:text-indigo-600",
                                    pathname === item.href ? "text-indigo-600" : "text-slate-500"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="font-bold text-slate-600 rounded-xl hover:bg-slate-50">Log in</Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-black shadow-lg shadow-indigo-100 gap-2">
                            Get Started <Rocket className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <button
                    className="md:hidden h-10 w-10 flex items-center justify-center text-slate-600"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-slate-100 p-6 space-y-4 animate-in slide-in-from-top duration-300">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="block text-lg font-bold text-slate-900"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className="pt-4 flex flex-col gap-3">
                        <Link href="/login" className="w-full">
                            <Button variant="outline" className="w-full h-12 rounded-xl">Log in</Button>
                        </Link>
                        <Link href="/signup" className="w-full">
                            <Button className="w-full h-12 rounded-xl bg-indigo-600">Get Started</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
