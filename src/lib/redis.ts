// Redis client for caching and job queues
// Uses Upstash Redis for serverless compatibility

import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL) {
    throw new Error('UPSTASH_REDIS_REST_URL is not defined');
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined');
}

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Cache helper functions
export const cache = {
    async get<T>(key: string): Promise<T | null> {
        const value = await redis.get(key);
        return value as T | null;
    },

    async set(key: string, value: any, ttl?: number): Promise<void> {
        if (ttl) {
            await redis.setex(key, ttl, JSON.stringify(value));
        } else {
            await redis.set(key, JSON.stringify(value));
        }
    },

    async del(key: string): Promise<void> {
        await redis.del(key);
    },

    async exists(key: string): Promise<boolean> {
        const result = await redis.exists(key);
        return result === 1;
    },
};
