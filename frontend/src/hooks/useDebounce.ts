import { useState, useEffect } from 'react';

/**
 * useDebounce hook delays updating the state value until after a specified delay time.
 * @param value The value to debounce.
 * @param delay The delay time in milliseconds.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
