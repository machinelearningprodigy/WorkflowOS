export class CacheManager {
    static set(key: string, value: any, ttlSeconds: number = 3600): void {
        if (typeof window === 'undefined') return;

        const item = {
            value,
            expiry: Date.now() + ttlSeconds * 1000,
        };
        try {
            localStorage.setItem(key, JSON.stringify(item));
        } catch (e) {
            console.error('Failed to set cache', e);
        }
    }

    static get<T>(key: string): T | null {
        if (typeof window === 'undefined') return null;

        try {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return null;

            const item = JSON.parse(itemStr);
            if (Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }

            return item.value as T;
        } catch (e) {
            return null;
        }
    }

    static remove(key: string): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    }

    static clear(): void {
        if (typeof window === 'undefined') return;
        localStorage.clear();
    }
}
