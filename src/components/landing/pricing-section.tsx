"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(true);

    const plans = [
        {
            name: "Starter",
            description: "Perfect for individuals and small side projects.",
            price: isAnnual ? 0 : 0,
            features: ["Up to 3 projects", "Basic workflow automation", "7-day history", "Community support"],
            cta: "Get Started",
            variant: "outline" as const,
        },
        {
            name: "Pro",
            description: "For growing teams that need more power and speed.",
            price: isAnnual ? 29 : 39,
            features: ["Unlimited projects", "Advanced workflow logic", "30-day history", "Priority email support", "Team collaboration"],
            cta: "Start Free Trial",
            variant: "default" as const,
            popular: true,
        },
        {
            name: "Enterprise",
            description: "Custom solutions for large-scale operations.",
            price: "Custom",
            features: ["Unlimited everything", "Dedicated success manager", "99.99% uptime SLA", "SSO & Audit logs", "Custom integrations"],
            cta: "Contact Sales",
            variant: "outline" as const,
        },
    ];

    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6"
                    >
                        Simple, transparent <span className="text-primary">pricing</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground mb-8"
                    >
                        Choose the plan that fits your needs. No hidden fees.
                    </motion.p>

                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className={`text-sm ${!isAnnual ? "font-bold" : "text-muted-foreground"}`}>Monthly</span>
                        <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
                        <span className={`text-sm ${isAnnual ? "font-bold" : "text-muted-foreground"}`}>
                            Yearly <span className="text-primary text-xs ml-1">(Save 20%)</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                                    <Badge className="bg-primary hover:bg-primary px-4 py-1">Most Popular</Badge>
                                </div>
                            )}
                            <Card className={`h-full flex flex-col ${plan.popular ? "border-primary shadow-lg scale-105 z-10 bg-background" : "bg-muted/30 border-transparent"}`}>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">
                                            {typeof plan.price === "number" ? "$" + plan.price : plan.price}
                                        </span>
                                        {typeof plan.price === "number" && (
                                            <span className="text-muted-foreground">/{isAnnual ? "mo" : "mo"}</span>
                                        )}
                                    </div>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant={plan.variant} size="lg">
                                        {plan.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
