import { useRef } from "react";
import { IUser } from "@/store/store";

type CacheEntry = { data: IUser[]; ts: number };

export function useSearchCache() {
  const ref = useRef<Map<string, CacheEntry>>(new Map());

  const get = (q: string) => ref.current.get(q)?.data ?? null;
  const hasFresh = (q: string, ttlMs = 60_000) => {
    const e = ref.current.get(q);
    if (!e) return false;
    return Date.now() - e.ts < ttlMs;
  };
  const set = (q: string, data: IUser[]) => {
    ref.current.set(q, { data, ts: Date.now() });
  };
  const clear = () => ref.current.clear();

  return { get, hasFresh, set, clear };
}
