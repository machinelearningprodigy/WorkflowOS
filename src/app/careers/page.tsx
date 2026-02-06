'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, MapPin, Search } from "lucide-react"

const jobs = [
    { title: "Senior Backend Engineer", team: "Engineering", location: "Remote / SF", type: "Full-time" },
    { title: "Product Designer", team: "Design", location: "Remote / London", type: "Full-time" },
    { title: "Infrastructure Engineer", team: "Engineering", location: "Remote", type: "Full-time" },
    { title: "Success Manager", team: "Sales", location: "New York", type: "Full-time" },
]

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Careers Hero */}
            <div className="bg-white pt-24 pb-20 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">We're Hiring!</Badge>
                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight sm:text-6xl">
                        Help us build the <br />
                        <span className="text-indigo-600">future of automation.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-600">
                        Join a fast-growing team of engineers, designers, and thinkers working to make automation accessible to everyone.
                    </p>
                </div>
            </div>

            {/* Why Join Us */}
            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-3">
                    {[
                        { title: "Remote First", desc: "Work from anywhere in the world. We believe in results, not clocking in." },
                        { title: "Modern Stack", desc: "We use the latest technologies and values clean, maintainable code." },
                        { title: "Great Benefits", desc: "Health insurance, learning budget, and generous stock options for everyone." }
                    ].map((item, i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-1 bg-indigo-500 w-12" />
                            <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                            <p className="text-slate-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Open Roles */}
            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-[3rem] shadow-sm border mb-24">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Open Positions</h2>
                        <p className="text-slate-500 mt-2">Find your next challenge.</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input className="w-full h-12 pl-10 pr-4 border rounded-xl" placeholder="Search roles..." />
                    </div>
                </div>

                <div className="space-y-4">
                    {jobs.map((job, i) => (
                        <div key={i} className="group flex flex-col md:flex-row items-center justify-between p-6 border rounded-2xl hover:border-indigo-500 hover:bg-slate-50 transition-all cursor-pointer">
                            <div className="flex gap-4 items-center">
                                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Briefcase className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                        <span>{job.team}</span>
                                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                                        <span className="bg-slate-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{job.type}</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" className="hidden md:flex gap-2 text-indigo-600">
                                View Role <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Closing banner */}
            <div className="bg-indigo-600 py-20 text-center text-white">
                <div className="max-w-2xl mx-auto px-4 space-y-6">
                    <h2 className="text-3xl font-bold">Don't see a perfect fit?</h2>
                    <p className="text-indigo-100 text-lg">We're always looking for talented people. Send us your resume and we'll keep you in mind for future openings.</p>
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 rounded-xl">
                        General Application
                    </Button>
                </div>
            </div>
        </div>
    )
}
