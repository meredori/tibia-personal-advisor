export type ProviderConfidence = "high" | "medium" | "low" | "unknown";

export interface SourceMetadataEnvelope {
  sourceId: string;
  lastUpdatedAt: string;
  confidence: ProviderConfidence;
  freshnessWindowMs: number;
}

export interface ProviderAdapterContract<
  TNormalizedOutput,
  TErrorState = unknown,
> extends SourceMetadataEnvelope {
  normalizedOutput: TNormalizedOutput;
  errorState: TErrorState | null;
}
