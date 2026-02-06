"use client";

import { motion } from "framer-motion";
import { Zap, Shield, BarChart3, Users, Workflow, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
    {
        icon: Workflow,
        title: "Visual Workflow Builder",
        description: "Drag-and-drop interface to create complex automated workflows without writing a single line of code.",
    },
    {
        icon: Zap,
        title: "Real-time Execution",
        description: "Experience lightning-fast processing with our proprietary event-driven architecture.",
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "Built for teams. Share workflows, assign tasks, and track progress together in real-time.",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "Bank-grade encryption, SOC2 compliance, and granular permission controls for your peace of mind.",
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        description: "Gain deep insights into your operations with customizable dashboards and automated reporting.",
    },
    {
        icon: Layers,
        title: "Seamless Integrations",
        description: "Connect with over 500+ tools including Slack, Salesforce, Jira, and GitHub out of the box.",
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6"
                    >
                        Everything you need to <span className="text-primary">scale</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground"
                    >
                        Powerful features designed to help you build, deploy, and manage your business logic with ease.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30 group">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
