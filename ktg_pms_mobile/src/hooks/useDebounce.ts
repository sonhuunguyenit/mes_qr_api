import { useState, useEffect, useRef } from 'react';

export const useDebounce = <T>(
  value: T,
  delay = 500,
  callback?: (val: T) => void
) => {
  const [debounced, setDebounced] = useState(value);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);

      if (callbackRef.current) {
        callbackRef.current(value);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
