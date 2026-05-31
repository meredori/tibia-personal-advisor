import type {
  ProviderAdapterContract,
  ProviderConfidence,
  SourceMetadataEnvelope,
} from "./provider-adapter-contract";

type Assert<T extends true> = T;

type ExpectedMetadataEnvelope = {
  sourceId: string;
  lastUpdatedAt: string;
  confidence: ProviderConfidence;
  freshnessWindowMs: number;
};

type ExpectedAdapterContract = ExpectedMetadataEnvelope & {
  normalizedOutput: { value: number };
  errorState: string | null;
};

type MetadataEnvelopeShapeCheck = Assert<
  SourceMetadataEnvelope extends ExpectedMetadataEnvelope ? true : false
>;

type MetadataEnvelopeShapeCheckReverse = Assert<
  ExpectedMetadataEnvelope extends SourceMetadataEnvelope ? true : false
>;

type AdapterContractShapeCheck = Assert<
  ProviderAdapterContract<{ value: number }, string> extends ExpectedAdapterContract
    ? true
    : false
>;

type AdapterContractShapeCheckReverse = Assert<
  ExpectedAdapterContract extends ProviderAdapterContract<{ value: number }, string>
    ? true
    : false
>;

export type ContractShapeChecks = [
  MetadataEnvelopeShapeCheck,
  MetadataEnvelopeShapeCheckReverse,
  AdapterContractShapeCheck,
  AdapterContractShapeCheckReverse,
];
