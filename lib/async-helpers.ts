/**
 * Asynchronous utilities for handling promises, retries, and concurrent operations
 * Provides robust helpers for async operations
 */

/**
 * Delays execution for specified milliseconds
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries an async function with exponential backoff
 * @param fn - Async function to retry
 * @param options - Retry configuration options
 * @returns Promise with function result
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  let lastError: Error;
  let currentDelay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts) {
        throw lastError;
      }

      if (onRetry) {
        onRetry(attempt, lastError);
      }

      await delay(currentDelay);
      currentDelay = Math.min(currentDelay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError!;
}

/**
 * Wraps a promise with a timeout
 * @param promise - Promise to wrap
 * @param ms - Timeout in milliseconds
 * @param errorMessage - Custom error message
 * @returns Promise that rejects on timeout
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    ),
  ]);
}

/**
 * Runs promises in batches with concurrency limit
 * @param items - Array of items to process
 * @param fn - Async function to run for each item
 * @param concurrency - Maximum concurrent operations
 * @returns Promise with array of results
 */
export async function batchProcess<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number = 5
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const promise = fn(item).then((result) => {
      results.push(result);
      const index = executing.indexOf(promise);
      if (index > -1) {
        executing.splice(index, 1);
      }
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Polls a function until condition is met or timeout
 * @param fn - Function to poll
 * @param condition - Condition function to check result
 * @param options - Polling configuration
 * @returns Promise with final result
 */
export async function poll<T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  options: {
    interval?: number;
    timeout?: number;
    onPoll?: (result: T, attempt: number) => void;
  } = {}
): Promise<T> {
  const { interval = 1000, timeout = 30000, onPoll } = options;

  const startTime = Date.now();
  let attempt = 0;

  while (true) {
    attempt++;
    const result = await fn();

    if (onPoll) {
      onPoll(result, attempt);
    }

    if (condition(result)) {
      return result;
    }

    if (Date.now() - startTime >= timeout) {
      throw new Error('Polling timeout exceeded');
    }

    await delay(interval);
  }
}

/**
 * Memoizes an async function with cache expiration
 * @param fn - Async function to memoize
 * @param ttl - Time to live in milliseconds (default: 5 minutes)
 * @returns Memoized function
 */
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  ttl: number = 5 * 60 * 1000
): T {
  const cache = new Map<string, { value: any; expiry: number }>();

  return (async (...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && cached.expiry > Date.now()) {
      return cached.value;
    }

    const value = await fn(...args);
    cache.set(key, { value, expiry: Date.now() + ttl });

    return value;
  }) as T;
}

/**
 * Debounces an async function
 * @param fn - Async function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null;
  let latestResolve: ((value: any) => void) | null = null;
  let latestReject: ((error: any) => void) | null = null;

  return (...args: Parameters<T>) => {
    return new Promise<ReturnType<T>>((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      latestResolve = resolve;
      latestReject = reject;

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          if (latestResolve) latestResolve(result);
        } catch (error) {
          if (latestReject) latestReject(error);
        }
      }, wait);
    });
  };
}

/**
 * Throttles an async function
 * @param fn - Async function to throttle
 * @param wait - Wait time in milliseconds
 * @returns Throttled function
 */
export function throttleAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T> | undefined> {
  let isThrottled = false;
  let lastResult: ReturnType<T> | undefined;

  return async (...args: Parameters<T>) => {
    if (isThrottled) {
      return lastResult;
    }

    isThrottled = true;
    lastResult = await fn(...args);

    setTimeout(() => {
      isThrottled = false;
    }, wait);

    return lastResult;
  };
}

/**
 * Runs async functions in sequence
 * @param functions - Array of async functions
 * @returns Promise with array of results
 */
export async function sequence<T>(
  functions: Array<() => Promise<T>>
): Promise<T[]> {
  const results: T[] = [];

  for (const fn of functions) {
    const result = await fn();
    results.push(result);
  }

  return results;
}

/**
 * Runs async functions in parallel with all settled results
 * @param promises - Array of promises
 * @returns Object with successful and failed results
 */
export async function allSettledWithResults<T>(
  promises: Promise<T>[]
): Promise<{
  fulfilled: T[];
  rejected: Error[];
}> {
  const results = await Promise.allSettled(promises);

  const fulfilled: T[] = [];
  const rejected: Error[] = [];

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      fulfilled.push(result.value);
    } else {
      rejected.push(
        result.reason instanceof Error
          ? result.reason
          : new Error(String(result.reason))
      );
    }
  });

  return { fulfilled, rejected };
}

/**
 * Creates a cancellable promise
 * @param promise - Promise to wrap
 * @returns Object with promise and cancel function
 */
export function makeCancellable<T>(promise: Promise<T>): {
  promise: Promise<T>;
  cancel: () => void;
} {
  let isCancelled = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise
      .then((value) => {
        if (!isCancelled) {
          resolve(value);
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          reject(error);
        }
      });
  });

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCancelled = true;
    },
  };
}

/**
 * Waits for multiple promises and returns first successful result
 * @param promises - Array of promises
 * @returns First successful result
 */
export async function raceSuccess<T>(promises: Promise<T>[]): Promise<T> {
  return new Promise((resolve, reject) => {
    let remainingPromises = promises.length;
    const errors: Error[] = [];

    promises.forEach((promise) => {
      promise
        .then(resolve)
        .catch((error) => {
          errors.push(error instanceof Error ? error : new Error(String(error)));
          remainingPromises--;

          if (remainingPromises === 0) {
            reject(new Error(`All promises failed: ${errors.map((e) => e.message).join(', ')}`));
          }
        });
    });
  });
}
