/**
 * A throttle function that ensures the last call is processed
 * @param func The function to throttle
 * @param wait The number of milliseconds to throttle
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastTime = 0;

  const processLastCall = () => {
    if (lastArgs) {
      func(...lastArgs);
      lastArgs = null;
    }
    timeout = null;
  };

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();

    // If this is the first call or enough time has elapsed
    if (!lastTime || now - lastTime >= wait) {
      func(...args);
      lastTime = now;
      lastArgs = null;
    } else {
      // Store the latest arguments
      lastArgs = args;

      // If there's no timeout set, create one
      if (!timeout) {
        timeout = setTimeout(
          () => {
            lastTime = Date.now();
            processLastCall();
          },
          wait - (now - lastTime)
        );
      }
    }
  };
}

/**
 * A debounce function that ensures immediate execution of first call
 * and delayed execution of subsequent calls
 * @param func The function to debounce
 * @param wait The number of milliseconds to wait
 * @returns A debounced version of the function
 */
export function debounceWithLeading<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let lastCallTime = 0;

  return function debounced(...args: Parameters<T>) {
    const now = Date.now();
    const isFirstCall = lastCallTime === 0;

    if (timeout) {
      clearTimeout(timeout);
    }

    if (isFirstCall || now - lastCallTime >= wait) {
      lastCallTime = now;
      func(...args);
    } else {
      timeout = setTimeout(() => {
        lastCallTime = now;
        func(...args);
      }, wait);
    }
  };
}
