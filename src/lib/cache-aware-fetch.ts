export interface CacheEntry<TValue> {
  value: TValue;
  fetchedAt: number;
  expiresAt: number;
}

export interface CacheStore<TValue> {
  get: () => Promise<CacheEntry<TValue> | null> | CacheEntry<TValue> | null;
  set: (entry: CacheEntry<TValue>) => Promise<void> | void;
}

export interface CacheAwareFetchOptions<TValue> {
  cache: CacheStore<TValue>;
  fetchFresh: () => Promise<TValue>;
  ttlMs: number;
  forceRefresh?: boolean;
  now?: () => number;
}

export interface CacheAwareFetchSuccess<TValue> {
  ok: true;
  source: "cache" | "fresh";
  data: TValue;
  fetchedAt: number;
  expiresAt: number;
}

export interface CacheAwareFetchFailure<TValue> {
  ok: false;
  error: unknown;
  stale?: {
    data: TValue;
    fetchedAt: number;
    expiresAt: number;
  };
}

export type CacheAwareFetchResult<TValue> =
  | CacheAwareFetchSuccess<TValue>
  | CacheAwareFetchFailure<TValue>;

const isFresh = (entry: CacheEntry<unknown>, nowMs: number): boolean =>
  entry.expiresAt > nowMs;

export const fetchWithCache = async <TValue>(
  options: CacheAwareFetchOptions<TValue>,
): Promise<CacheAwareFetchResult<TValue>> => {
  const now = options.now ?? Date.now;
  const cached = await options.cache.get();

  if (cached && isFresh(cached, now()) && !options.forceRefresh) {
    return {
      ok: true,
      source: "cache",
      data: cached.value,
      fetchedAt: cached.fetchedAt,
      expiresAt: cached.expiresAt,
    };
  }

  try {
    const data = await options.fetchFresh();
    const fetchedAt = now();
    const entry: CacheEntry<TValue> = {
      value: data,
      fetchedAt,
      expiresAt: fetchedAt + options.ttlMs,
    };

    await options.cache.set(entry);

    return {
      ok: true,
      source: "fresh",
      data: entry.value,
      fetchedAt: entry.fetchedAt,
      expiresAt: entry.expiresAt,
    };
  } catch (error) {
    return {
      ok: false,
      error,
      stale: cached
        ? {
            data: cached.value,
            fetchedAt: cached.fetchedAt,
            expiresAt: cached.expiresAt,
          }
        : undefined,
    };
  }
};
