
import { useRef, useEffect } from 'react';

/**
 * Hook that returns a Ref with the latest value of the passed variable.
 * Useful for accessing the latest value in callbacks (like Event Listeners or Timeouts)
 * without adding it to the dependency array, avoiding unnecessary re-creations.
 * 
 * @param value The value to keep track of
 * @returns A Ref object containing the latest value
 */
export function useLatest<T>(value: T) {
    const ref = useRef(value);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref;
}
