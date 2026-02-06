export const appConfig = {
    name: "WorkflowOS",
    description: "The operating system for modern automation.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://workflowos.com",
    apiPrefix: "/api/v1",
    version: "1.0.0",

    // Feature flags
    features: {
        aiBuilder: true,
        realTimeLogs: true,
        enterpriseSecurity: false,
    },

    // Support info
    support: {
        email: "support@workflowos.com",
        docs: "https://docs.workflowos.com",
        status: "https://status.workflowos.com",
    },

    // Social
    social: {
        twitter: "@workflowos",
        github: "workflowos/platform",
        linkedin: "workflowos",
    }
}
