'use client'

import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"

const posts = [
    {
        slug: "future-of-no-code-automation",
        title: "The Future of No-Code Automation in 2026",
        excerpt: "Discover how AI and agentic systems are changing the landscape of business processes.",
        date: "Feb 01, 2026",
        readTime: "5 min read",
        category: "Insights"
    },
    {
        slug: "scaling-workflows-for-enterprise",
        title: "Scaling Workflows for Enterprise Operations",
        excerpt: "Best practices for managing thousands of concurrent executions without breaking a sweat.",
        date: "Jan 15, 2026",
        readTime: "8 min read",
        category: "Engineering"
    },
    {
        slug: "connecting-your-stack",
        title: "Connecting Your Entire Tech Stack",
        excerpt: "A guide to building a unified data flow across all your favorite business applications.",
        date: "Dec 10, 2025",
        readTime: "4 min read",
        category: "Guides"
    }
]

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-20">
                    <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">Our Blog</Badge>
                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight sm:text-6xl">
                        Stories & <span className="text-indigo-600">Insights.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-600">
                        The latest news from the world of automation, productivity, and no-code engineering.
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-3">
                    {posts.map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
                            <article className="space-y-4">
                                <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden mb-6 border relative group-hover:border-indigo-500 transition-all">
                                    <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/0 transition-all" />
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-indigo-600">
                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 rounded-lg">{post.category}</Badge>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                    {post.title}
                                </h2>
                                <p className="text-slate-500 leading-relaxed text-sm line-clamp-2">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-6 text-xs text-slate-400 font-medium pt-2">
                                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {post.date}</div>
                                    <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readTime}</div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                <div className="mt-24 p-12 bg-slate-900 text-white rounded-[3rem] text-center space-y-6">
                    <h2 className="text-3xl font-bold">Subscribe to our newsletter</h2>
                    <p className="text-slate-400 max-w-xl mx-auto">Get the latest articles and product updates delivered directly to your inbox every two weeks.</p>
                    <form className="max-w-md mx-auto flex gap-4">
                        <input className="flex-1 h-12 px-6 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="jane@example.com" />
                        <button className="bg-indigo-600 text-white px-8 h-12 rounded-xl font-bold hover:bg-indigo-500 transition-colors">Subscribe</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
