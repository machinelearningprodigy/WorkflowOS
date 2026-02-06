import posthog from 'posthog-js';

const IS_BROWSER = typeof window !== 'undefined';

if (IS_BROWSER) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        loaded: (ph) => {
            if (process.env.NODE_ENV === 'development') ph.opt_out_capturing();
        },
    });
}

export const AnalyticsTracker = {
    identify: (userId: string, traits?: Record<string, any>) => {
        if (IS_BROWSER) {
            posthog.identify(userId, traits);
        }
    },

    track: (eventName: string, properties?: Record<string, any>) => {
        if (IS_BROWSER) {
            posthog.capture(eventName, properties);
        } else {
            console.log(`[Analytics] ${eventName}`, properties);
        }
    },

    reset: () => {
        if (IS_BROWSER) {
            posthog.reset();
        }
    }
};
