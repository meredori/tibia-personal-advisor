import assert from "node:assert/strict";
import test from "node:test";

import {
  type CacheEntry,
  fetchWithCache,
  type CacheStore,
} from "./cache-aware-fetch.ts";

const createMemoryCache = <TValue>(
  entry: CacheEntry<TValue> | null,
): {
  cache: CacheStore<TValue>;
  getStoredEntry: () => CacheEntry<TValue> | null;
} => {
  let current = entry;

  return {
    cache: {
      get: () => current,
      set: (next) => {
        current = next;
      },
    },
    getStoredEntry: () => current,
  };
};

test("returns cached value when cache entry is fresh", async () => {
  let fetchCount = 0;
  const { cache, getStoredEntry } = createMemoryCache({
    value: { payload: "cached" },
    fetchedAt: 1_000,
    expiresAt: 2_000,
  });

  const result = await fetchWithCache({
    cache,
    ttlMs: 600,
    now: () => 1_500,
    fetchFresh: async () => {
      fetchCount += 1;
      return { payload: "fresh" };
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.source, "cache");
  assert.deepEqual(result.data, { payload: "cached" });
  assert.equal(fetchCount, 0);
  assert.deepEqual(getStoredEntry()?.value, { payload: "cached" });
});

test("fetches and stores fresh value on cache miss", async () => {
  const { cache, getStoredEntry } = createMemoryCache<{ payload: string }>(
    null,
  );

  const result = await fetchWithCache({
    cache,
    ttlMs: 500,
    now: () => 100,
    fetchFresh: async () => ({ payload: "fresh" }),
  });

  assert.equal(result.ok, true);
  assert.equal(result.source, "fresh");
  assert.deepEqual(result.data, { payload: "fresh" });
  assert.equal(result.fetchedAt, 100);
  assert.equal(result.expiresAt, 600);
  assert.deepEqual(getStoredEntry(), {
    value: { payload: "fresh" },
    fetchedAt: 100,
    expiresAt: 600,
  });
});

test("refreshes stale cache entries", async () => {
  const { cache, getStoredEntry } = createMemoryCache({
    value: { payload: "stale" },
    fetchedAt: 1_000,
    expiresAt: 1_100,
  });

  const result = await fetchWithCache({
    cache,
    ttlMs: 200,
    now: () => 1_300,
    fetchFresh: async () => ({ payload: "fresh" }),
  });

  assert.equal(result.ok, true);
  assert.equal(result.source, "fresh");
  assert.deepEqual(result.data, { payload: "fresh" });
  assert.deepEqual(getStoredEntry(), {
    value: { payload: "fresh" },
    fetchedAt: 1_300,
    expiresAt: 1_500,
  });
});

test("returns failure with stale data when refresh fails", async () => {
  const { cache, getStoredEntry } = createMemoryCache({
    value: { payload: "stale" },
    fetchedAt: 500,
    expiresAt: 600,
  });

  const error = new Error("network failed");
  const result = await fetchWithCache({
    cache,
    ttlMs: 500,
    now: () => 1_200,
    fetchFresh: async () => {
      throw error;
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.error, error);
  assert.deepEqual(result.stale, {
    data: { payload: "stale" },
    fetchedAt: 500,
    expiresAt: 600,
  });
  assert.deepEqual(getStoredEntry(), {
    value: { payload: "stale" },
    fetchedAt: 500,
    expiresAt: 600,
  });
});

test("force refresh bypasses fresh cache entries", async () => {
  let fetchCount = 0;
  const { cache, getStoredEntry } = createMemoryCache({
    value: { payload: "cached" },
    fetchedAt: 1_000,
    expiresAt: 2_000,
  });

  const result = await fetchWithCache({
    cache,
    ttlMs: 600,
    now: () => 1_500,
    forceRefresh: true,
    fetchFresh: async () => {
      fetchCount += 1;
      return { payload: "fresh" };
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.source, "fresh");
  assert.deepEqual(result.data, { payload: "fresh" });
  assert.equal(fetchCount, 1);
  assert.deepEqual(getStoredEntry(), {
    value: { payload: "fresh" },
    fetchedAt: 1_500,
    expiresAt: 2_100,
  });
});

test("force refresh returns stale data when refresh fails", async () => {
  const { cache, getStoredEntry } = createMemoryCache({
    value: { payload: "cached" },
    fetchedAt: 1_000,
    expiresAt: 2_000,
  });

  const error = new Error("network failed");
  const result = await fetchWithCache({
    cache,
    ttlMs: 600,
    now: () => 1_500,
    forceRefresh: true,
    fetchFresh: async () => {
      throw error;
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.error, error);
  assert.deepEqual(result.stale, {
    data: { payload: "cached" },
    fetchedAt: 1_000,
    expiresAt: 2_000,
  });
  assert.deepEqual(getStoredEntry(), {
    value: { payload: "cached" },
    fetchedAt: 1_000,
    expiresAt: 2_000,
  });
});
