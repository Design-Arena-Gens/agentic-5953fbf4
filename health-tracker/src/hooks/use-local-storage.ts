'use client';

import { useEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        setState(JSON.parse(raw) as T);
      }
    } catch (error) {
      console.warn(`Failed to read localStorage key "${key}"`, error);
    } finally {
      setHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Failed to write localStorage key "${key}"`, error);
    }
  }, [hydrated, key, state]);

  return [state, setState, hydrated] as const;
}
