/**
 * Represents a result of an operation with a success status, data, and optional error message.
 * @template T - The type of the data returned
 * @property success - Indicates if the operation was successful
 * @property data - The data returned by the operation or null if unsuccessful
 * @property error - Optional error message if the operation failed
 */
export type Result<T> = {
  success: boolean;
  data: T | null;
  error?: string;
};
