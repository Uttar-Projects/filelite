export type SizedCandidate = {
  id: string;
  bytes: number;
};

export function chooseCompression(input: {
  originalBytes: number;
  dimensionsChanged: boolean;
  explicitFormatChange: boolean;
  candidates: SizedCandidate[];
}): { id: string; keptOriginal: boolean } {
  let smallest: SizedCandidate | null = null;
  for (const candidate of input.candidates) {
    if (!Number.isFinite(candidate.bytes) || candidate.bytes <= 0) continue;
    if (!smallest || candidate.bytes < smallest.bytes) smallest = candidate;
  }

  if (!smallest) return { id: "original", keptOriginal: true };

  const mayKeepOriginal = !input.dimensionsChanged && !input.explicitFormatChange;
  if (mayKeepOriginal && smallest.bytes >= input.originalBytes) {
    return { id: "original", keptOriginal: true };
  }

  return { id: smallest.id, keptOriginal: false };
}
