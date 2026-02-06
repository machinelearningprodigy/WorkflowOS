"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

export function Breadcrumbs() {
    const pathname = usePathname()
    const segments = pathname.split("/").filter(Boolean)

    if (segments.length === 0) return null

    return (
        <nav className="flex items-center gap-2 mb-8">
            <Link href="/dashboard" className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors">
                <Home className="h-4 w-4" />
            </Link>

            {segments.map((segment, i) => {
                const href = `/${segments.slice(0, i + 1).join("/")}`
                const isLast = i === segments.length - 1
                const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")

                return (
                    <div key={href} className="flex items-center gap-2">
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                        {isLast ? (
                            <span className="text-sm font-black text-slate-900 px-2 py-0.5 bg-slate-100 rounded-md">
                                {label}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className="text-sm font-bold text-slate-500 hover:text-indigo-600 px-2 transition-colors"
                            >
                                {label}
                            </Link>
                        )}
                    </div>
                )
            })}
        </nav>
    )
}
