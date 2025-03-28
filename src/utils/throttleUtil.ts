/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * A throttle function that ensures the last call is processed
 * Uses performance.now() for more precise timing and better performance
 * @param func The function to throttle
 * @param wait The number of milliseconds to throttle
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastTime = 0;

  // Pre-bind the cleanup function to avoid creating it on each call
  const cleanup = () => {
    timeoutId = null;
    if (lastArgs) {
      const args = lastArgs;
      lastArgs = null;
      lastTime = performance.now();
      func(...args);
    }
  };

  return function throttled(...args: Parameters<T>): void {
    const now = performance.now();
    const timeSinceLastCall = now - lastTime;

    if (timeSinceLastCall >= wait) {
      // Clear any existing timeout since we're executing immediately
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      func(...args);
    } else {
      lastArgs = args;
      if (!timeoutId) {
        timeoutId = setTimeout(cleanup, wait - timeSinceLastCall);
      }
    }
  };
}
