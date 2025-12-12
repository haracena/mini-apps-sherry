/**
 * Stacks blockchain data caching utilities
 *
 * Provides caching mechanisms to optimize API calls and reduce load times
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class BlockchainCache {
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 30000) {
    // Default 30 seconds
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Get cached data
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cached data
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, entry);
  }

  /**
   * Clear specific key or all cache
   */
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      const isExpired = now - entry.timestamp > entry.ttl;
      if (isExpired) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Singleton instance
export const stacksCache = new BlockchainCache();

/**
 * Cache decorator for async functions
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const cacheKey = keyGenerator(...args);
    const cached = stacksCache.get<ReturnType<T>>(cacheKey);

    if (cached !== null) {
      return cached;
    }

    const result = await fn(...args);
    stacksCache.set(cacheKey, result, ttl);

    return result;
  }) as T;
}

/**
 * Batching utility for multiple requests
 */
export class RequestBatcher<T, R> {
  private queue: Array<{
    params: T;
    resolve: (value: R) => void;
    reject: (error: any) => void;
  }> = [];
  private timeout: NodeJS.Timeout | null = null;
  private batchDelay: number;
  private executor: (batch: T[]) => Promise<R[]>;

  constructor(executor: (batch: T[]) => Promise<R[]>, batchDelay: number = 50) {
    this.executor = executor;
    this.batchDelay = batchDelay;
  }

  add(params: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.queue.push({ params, resolve, reject });

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => this.flush(), this.batchDelay);
    });
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = [...this.queue];
    this.queue = [];

    try {
      const params = batch.map((item) => item.params);
      const results = await this.executor(params);

      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach((item) => {
        item.reject(error);
      });
    }
  }
}

/**
 * Debounce utility for API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle utility for API calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Auto-clear expired cache entries every 5 minutes
if (typeof window !== "undefined") {
  setInterval(() => {
    stacksCache.clearExpired();
  }, 5 * 60 * 1000);
}
