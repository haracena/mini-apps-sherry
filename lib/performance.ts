/**
 * Performance monitoring utilities
 * Provides helpers for measuring and tracking application performance
 */

import { logger } from './logger';

/**
 * Performance metric data structure
 */
export interface PerformanceMetric {
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  metadata?: Record<string, unknown>;
}

/**
 * Performance mark for measuring durations
 */
class PerformanceMark {
  private startTime: number;
  private name: string;
  private metadata?: Record<string, unknown>;

  constructor(name: string, metadata?: Record<string, unknown>) {
    this.name = name;
    this.metadata = metadata;
    this.startTime = performance.now();
  }

  /**
   * Ends the performance measurement
   * @returns Performance metric
   */
  end(): PerformanceMetric {
    const endTime = performance.now();
    const duration = endTime - this.startTime;

    const metric: PerformanceMetric = {
      name: this.name,
      duration,
      startTime: this.startTime,
      endTime,
      metadata: this.metadata,
    };

    logger.debug(`Performance: ${this.name} took ${duration.toFixed(2)}ms`, this.metadata);

    return metric;
  }
}

/**
 * Starts a performance measurement
 * @param name - Name of the measurement
 * @param metadata - Optional metadata
 * @returns Performance mark instance
 */
export function startMeasure(name: string, metadata?: Record<string, unknown>): PerformanceMark {
  return new PerformanceMark(name, metadata);
}

/**
 * Measures the execution time of a synchronous function
 * @param name - Name of the measurement
 * @param fn - Function to measure
 * @returns Function result and performance metric
 */
export function measure<T>(
  name: string,
  fn: () => T
): { result: T; metric: PerformanceMetric } {
  const mark = startMeasure(name);
  const result = fn();
  const metric = mark.end();

  return { result, metric };
}

/**
 * Measures the execution time of an async function
 * @param name - Name of the measurement
 * @param fn - Async function to measure
 * @returns Function result and performance metric
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; metric: PerformanceMetric }> {
  const mark = startMeasure(name);
  const result = await fn();
  const metric = mark.end();

  return { result, metric };
}

/**
 * Decorator for measuring method execution time
 * @param target - Target object
 * @param propertyKey - Method name
 * @param descriptor - Property descriptor
 */
export function Measure(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const mark = startMeasure(`${target.constructor.name}.${propertyKey}`);
    const result = originalMethod.apply(this, args);

    if (result instanceof Promise) {
      return result.finally(() => mark.end());
    }

    mark.end();
    return result;
  };

  return descriptor;
}

/**
 * Tracks long tasks (tasks taking longer than threshold)
 */
export class LongTaskMonitor {
  private threshold: number;
  private tasks: PerformanceMetric[] = [];

  constructor(threshold: number = 50) {
    this.threshold = threshold;
  }

  /**
   * Monitors a task and logs if it exceeds threshold
   * @param name - Task name
   * @param fn - Function to monitor
   * @returns Function result
   */
  async monitor<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const { result, metric } = await measureAsync(name, fn);

    if (metric.duration > this.threshold) {
      this.tasks.push(metric);
      logger.warn(`Long task detected: ${name} took ${metric.duration.toFixed(2)}ms`);
    }

    return result;
  }

  /**
   * Gets all recorded long tasks
   */
  getTasks(): PerformanceMetric[] {
    return [...this.tasks];
  }

  /**
   * Clears recorded tasks
   */
  clear(): void {
    this.tasks = [];
  }
}

/**
 * Debounced performance logger
 * Collects metrics and logs them in batches
 */
export class PerformanceLogger {
  private metrics: PerformanceMetric[] = [];
  private flushInterval: number;
  private timerId: NodeJS.Timeout | null = null;

  constructor(flushInterval: number = 5000) {
    this.flushInterval = flushInterval;
  }

  /**
   * Adds a metric to the logger
   */
  log(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    if (!this.timerId) {
      this.timerId = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  /**
   * Flushes all metrics to logger
   */
  flush(): void {
    if (this.metrics.length === 0) return;

    const summary = this.getSummary();
    logger.info('Performance Summary', summary);

    this.metrics = [];
    this.timerId = null;
  }

  /**
   * Gets summary statistics of collected metrics
   */
  private getSummary(): Record<string, any> {
    const grouped = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric.duration);
      return acc;
    }, {} as Record<string, number[]>);

    const summary: Record<string, any> = {};

    Object.entries(grouped).forEach(([name, durations]) => {
      const sorted = durations.sort((a, b) => a - b);
      const sum = durations.reduce((a, b) => a + b, 0);

      summary[name] = {
        count: durations.length,
        avg: sum / durations.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        median: sorted[Math.floor(sorted.length / 2)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
      };
    });

    return summary;
  }
}

/**
 * Measures bundle size impact
 */
export function measureBundleSize(): void {
  if (typeof window === 'undefined') return;

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  const scriptResources = resources.filter((r) =>
    r.name.endsWith('.js') || r.name.endsWith('.mjs')
  );

  const totalSize = scriptResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);

  logger.info('Bundle Analysis', {
    scriptCount: scriptResources.length,
    totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
    scripts: scriptResources.map((r) => ({
      name: r.name.split('/').pop(),
      size: `${((r.transferSize || 0) / 1024).toFixed(2)} KB`,
      duration: `${r.duration.toFixed(2)}ms`,
    })),
  });
}

/**
 * Measures First Contentful Paint (FCP)
 */
export function measureFCP(): void {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        logger.info('First Contentful Paint', {
          fcp: `${entry.startTime.toFixed(2)}ms`,
        });
      }
    }
  });

  try {
    observer.observe({ type: 'paint', buffered: true });
  } catch (error) {
    logger.warn('FCP measurement not supported');
  }
}

/**
 * Measures Largest Contentful Paint (LCP)
 */
export function measureLCP(): void {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];

    logger.info('Largest Contentful Paint', {
      lcp: `${lastEntry.startTime.toFixed(2)}ms`,
    });
  });

  try {
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    logger.warn('LCP measurement not supported');
  }
}

/**
 * Measures Cumulative Layout Shift (CLS)
 */
export function measureCLS(): void {
  if (typeof window === 'undefined') return;

  let clsValue = 0;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }

    logger.info('Cumulative Layout Shift', {
      cls: clsValue.toFixed(4),
    });
  });

  try {
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    logger.warn('CLS measurement not supported');
  }
}

/**
 * Initializes all Web Vitals measurements
 */
export function initWebVitals(): void {
  measureFCP();
  measureLCP();
  measureCLS();
}
