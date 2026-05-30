export type ProviderConfidence = "high" | "medium" | "low" | "unknown";

/**
 * Reusable source metadata attached to normalized provider data.
 *
 * - `lastUpdatedAt` must be an ISO 8601 timestamp string.
 * - `freshnessWindowMs` is the duration for which the data is considered fresh.
 */
export interface SourceMetadataEnvelope {
  sourceId: string;
  lastUpdatedAt: string;
  confidence: ProviderConfidence;
  freshnessWindowMs: number;
}

/**
 * Provider-agnostic adapter contract for normalized outputs.
 *
 * `normalizedOutput` contains provider data already transformed into a shared shape.
 * `errorState` should be `null` for successful responses, otherwise it carries provider error details.
 */
export interface ProviderAdapterContract<
  TNormalizedOutput,
  TErrorState = unknown,
> extends SourceMetadataEnvelope {
  normalizedOutput: TNormalizedOutput;
  errorState: TErrorState | null;
}
