export const featuresConfig = {
    // Canvas related features
    canvas: {
        autoLayout: true,
        snapToGrid: true,
        minimap: true,
    },

    // Automation features
    automation: {
        maxRetries: 3,
        parallelExecutions: 10,
        webhookTimeout: 30000, // 30s
    },

    // AI capabilities
    ai: {
        modelName: "gpt-4-turbo",
        maxTokens: 4096,
        temperature: 0.7,
    },

    // Integration capabilities
    integrations: {
        pollInterval: 60, // 1 minute
        oauthRefreshBuffer: 300, // 5 minutes before expiry
    }
}