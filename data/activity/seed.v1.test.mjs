import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sourceMetadataKeys = [
  "id",
  "type",
  "lastUpdated",
  "confidence",
  "freshnessWindow",
  "errorState",
];

const recordMetadataKeys = [
  "source",
  "lastUpdated",
  "confidence",
  "freshnessWindow",
  "errorState",
];

const allowedConfidence = new Set(["high", "medium", "low", "unknown"]);

function validateMetadata(record, requiredKeys) {
  for (const key of requiredKeys) {
    assert.ok(Object.hasOwn(record, key), `missing metadata key: ${key}`);
  }
  assert.ok(allowedConfidence.has(record.confidence), "invalid confidence");
}

test("activity seed v1 has required shape and stays offline", async () => {
  const raw = await readFile(new URL("./seed.v1.json", import.meta.url), "utf8");
  const seed = JSON.parse(raw);

  assert.equal(seed.version, "v1");
  validateMetadata(seed.source, sourceMetadataKeys);

  for (const section of ["activities", "tasks", "routines"]) {
    assert.ok(Array.isArray(seed[section]), `${section} must be an array`);
    assert.ok(seed[section].length > 0, `${section} must not be empty`);

    for (const item of seed[section]) {
      assert.equal(typeof item.id, "string");
      assert.ok(item.id.length > 0, `${section} item id is required`);
      assert.equal(typeof item.name, "string");
      assert.ok(item.name.length > 0, `${section} item name is required`);
      validateMetadata(item.metadata, recordMetadataKeys);
    }
  }

  assert.ok(!/https?:\/\//i.test(raw), "seed dataset must remain offline-only");
});
