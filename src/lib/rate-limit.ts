// Rate limiting middleware for API protection
// Prevents abuse and DDoS attacks

import { redis } from './redis';

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    keyPrefix?: string;
}

/**
 * Rate limit checker
 * Returns true if request should be allowed, false if rate limited
 */
export async function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const { maxRequests, windowMs, keyPrefix = 'ratelimit' } = config;
    const key = `${keyPrefix}:${identifier}`;

    try {
        const current = await redis.get<number>(key);
        const now = Date.now();

        if (!current) {
            // First request in window
            await redis.setex(key, Math.ceil(windowMs / 1000), 1);
            return {
                allowed: true,
                remaining: maxRequests - 1,
                resetAt: now + windowMs,
            };
        }

        if (current >= maxRequests) {
            // Rate limit exceeded
            const ttl = await redis.ttl(key);
            return {
                allowed: false,
                remaining: 0,
                resetAt: now + (ttl * 1000),
            };
        }

        // Increment counter
        await redis.incr(key);

        return {
            allowed: true,
            remaining: maxRequests - current - 1,
            resetAt: now + windowMs,
        };
    } catch (error) {
        console.error('Rate limit check error:', error);
        // Fail open - allow request if Redis is down
        return {
            allowed: true,
            remaining: maxRequests,
            resetAt: now + windowMs,
        };
    }
}

/**
 * Rate limit by IP address
 */
export async function rateLimitByIp(
    ip: string,
    maxRequests: number = 100,
    windowMs: number = 60000
) {
    return checkRateLimit(ip, {
        maxRequests,
        windowMs,
        keyPrefix: 'ratelimit:ip',
    });
}

/**
 * Rate limit by user ID
 */
export async function rateLimitByUser(
    userId: string,
    maxRequests: number = 1000,
    windowMs: number = 60000
) {
    return checkRateLimit(userId, {
        maxRequests,
        windowMs,
        keyPrefix: 'ratelimit:user',
    });
}

/**
 * Rate limit by API key
 */
export async function rateLimitByApiKey(
    apiKey: string,
    maxRequests: number = 10000,
    windowMs: number = 60000
) {
    return checkRateLimit(apiKey, {
        maxRequests,
        windowMs,
        keyPrefix: 'ratelimit:apikey',
    });
}

/**
 * Strict rate limit for sensitive operations (login, password reset, etc.)
 */
export async function strictRateLimit(
    identifier: string,
    maxRequests: number = 5,
    windowMs: number = 900000 // 15 minutes
) {
    return checkRateLimit(identifier, {
        maxRequests,
        windowMs,
        keyPrefix: 'ratelimit:strict',
    });
}
