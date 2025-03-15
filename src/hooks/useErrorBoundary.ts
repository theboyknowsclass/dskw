import { useState, useCallback } from 'react';

/**
 * A hook for testing error boundaries
 *
 * This hook provides functions to throw controlled errors
 * which can be used to test that error boundaries are working correctly.
 */
export const useErrorBoundary = () => {
  const [hasError, setHasError] = useState(false);

  /**
   * Throws a standard error with the specified message
   * This will be caught by the nearest error boundary
   */
  const throwError = useCallback(
    (message: string = 'Test error from useErrorBoundary') => {
      setHasError(true);
      throw new Error(message);
    },
    []
  );

  /**
   * Throws an error that simulates a gesture handler error
   * This will be caught and identified as a gesture error by the error boundary
   */
  const throwGestureError = useCallback(() => {
    setHasError(true);
    const error = new Error('GestureHandler failed to process touch event');
    // Add a stack trace that includes GestureHandler to trigger detection
    error.stack =
      'Error: GestureHandler failed\n    at PanGestureHandler.onGestureEvent';
    throw error;
  }, []);

  /**
   * Throws an error that simulates a long press gesture error
   * This will be caught and identified as a long press error by the error boundary
   */
  const throwLongPressError = useCallback(() => {
    setHasError(true);
    const error = new Error(
      'Cannot update a component while LongPressGestureHandler is active'
    );
    // Add a stack trace that includes LongPressGestureHandler to trigger detection
    error.stack =
      'Error: Cannot update component\n    at LongPressGestureHandler.onStateChange\n    at setTimeout (timer: 1000)';
    throw error;
  }, []);

  /**
   * Asynchronously throws an error in a promise
   * This can be used to test error handling in async code
   */
  const throwAsyncError = useCallback(
    async (message: string = 'Async test error from useErrorBoundary') => {
      setHasError(true);
      return Promise.reject(new Error(message));
    },
    []
  );

  return {
    hasError,
    throwError,
    throwGestureError,
    throwLongPressError,
    throwAsyncError,
  };
};
