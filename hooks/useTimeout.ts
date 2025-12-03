import { useEffect, useRef } from 'react';

/**
 * Hook to handle setTimeout with automatic cleanup
 * @param callback - Function to call after delay
 * @param delay - Delay in milliseconds (null to pause)
 */
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setTimeout(() => savedCallback.current(), delay);

    return () => clearTimeout(id);
  }, [delay]);
}
