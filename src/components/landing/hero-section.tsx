"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-8"
                >
                    <Badge variant="secondary" className="px-4 py-2 rounded-full text-sm font-medium border border-primary/20 bg-background/50 backdrop-blur-sm">
                        <span className="mr-2 text-primary">✨</span> New: AI Workflow Automation
                        <ChevronRight className="ml-1 h-3 w-3" />
                    </Badge>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
                >
                    Your Work, <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient bg-300%">
                        Orchestrated Perfectly
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
                >
                    Streamline operations, automate repetitive tasks, and coordinate your team with the operating system designed for modern business efficiency.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button size="lg" className="h-12 px-8 text-lg rounded-full group" asChild>
                        <Link href="/dashboard">
                            Start Building
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full" asChild>
                        <Link href="#demo">
                            <Play className="mr-2 h-4 w-4 fill-current" />
                            Watch Demo
                        </Link>
                    </Button>
                </motion.div>

                {/* Dashboard Preview / Abstract visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="mt-20 relative mx-auto max-w-5xl"
                >
                    <div className="relative rounded-xl border bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/9] group">
                        {/* Mock Header */}
                        <div className="h-12 border-b flex items-center px-4 gap-2 bg-muted/30">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        {/* Mock Content */}
                        <div className="p-8 grid grid-cols-12 gap-6 h-full bg-gradient-to-br from-background to-muted/20">
                            <div className="col-span-3 space-y-4">
                                <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                                <div className="h-32 w-full bg-primary/5 rounded-lg border border-primary/10" />
                            </div>
                            <div className="col-span-9 space-y-6">
                                <div className="flex justify-between">
                                    <div className="h-10 w-1/3 bg-muted rounded animate-pulse" />
                                    <div className="h-10 w-32 bg-primary rounded animate-pulse" />
                                </div>
                                <div className="h-64 rounded-lg border bg-card shadow-sm p-4 grid place-items-center text-muted-foreground/30 text-6xl font-black select-none">
                                    WORKFLOW CANVAS
                                </div>
                            </div>
                        </div>

                        {/* Overlay Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>

                    {/* Decorative elements behind */}
                    <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
                    <div className="absolute -z-10 -top-10 -left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl opacity-50" />
                </motion.div>
            </div>
        </section>
    );
}
