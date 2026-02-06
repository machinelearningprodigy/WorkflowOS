export const pricingConfig = {
    plans: [
        {
            id: "starter",
            name: "Starter",
            price: 0,
            interval: "month",
            description: "Perfect for exploring logic.",
            features: [
                "1,000 executions / mo",
                "5 active workflows",
                "Community support",
                "Basic analytics"
            ]
        },
        {
            id: "pro",
            name: "Pro",
            price: 49,
            interval: "month",
            description: "Powering your growth.",
            features: [
                "10,000 executions / mo",
                "Unlimited workflows",
                "24h Priority support",
                "Advanced analytics",
                "Custom fields"
            ],
            isPopular: true
        },
        {
            id: "team",
            name: "Team",
            price: 149,
            interval: "month",
            description: "Automation for organizations.",
            features: [
                "50,000 executions / mo",
                "Team collaboration",
                "Shared credentials",
                "Audit logs",
                "Premium integrations"
            ]
        }
    ]
}
