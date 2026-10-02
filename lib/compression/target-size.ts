export type QualityHit<T extends { size: number }> = {
  quality: number;
  result: T;
  metTarget: boolean;
  attempts: number;
};

export function roundQuality(quality: number): number {
  return Math.round(quality * 100) / 100;
}

export async function searchQuality<T extends { size: number }>(options: {
  minQuality: number;
  maxQuality: number;
  targetBytes: number;
  iterations?: number;
  encode: (quality: number) => Promise<T>;
  onProgress?: (progress: number) => void;
}): Promise<QualityHit<T>> {
  const minQuality = roundQuality(Math.min(options.minQuality, options.maxQuality));
  const maxQuality = roundQuality(Math.max(options.minQuality, options.maxQuality));
  const iterations = options.iterations ?? 7;
  const cache = new Map<number, T>();

  async function encode(quality: number): Promise<T> {
    const key = roundQuality(quality);
    const cached = cache.get(key);
    if (cached) return cached;
    const result = await options.encode(key);
    cache.set(key, result);
    return result;
  }

  const steps = iterations + 2;
  const top = await encode(maxQuality);
  options.onProgress?.(Math.round((1 / steps) * 100));
  if (top.size <= options.targetBytes) {
    options.onProgress?.(100);
    return { quality: maxQuality, result: top, metTarget: true, attempts: cache.size };
  }

  let low = minQuality;
  let high = maxQuality;
  let bestUnder: { quality: number; result: T } | null = null;
  let smallest: { quality: number; result: T } = { quality: maxQuality, result: top };
  let previous = maxQuality;

  for (let index = 0; index < iterations; index += 1) {
    const quality = roundQuality((low + high) / 2);
    if (quality === previous) break;
    previous = quality;
    const result = await encode(quality);
    options.onProgress?.(Math.round(((index + 2) / steps) * 100));
    if (result.size < smallest.result.size) smallest = { quality, result };
    if (result.size <= options.targetBytes) {
      bestUnder = { quality, result };
      low = quality;
    } else {
      high = quality;
    }
  }

  if (!bestUnder) {
    const floor = await encode(minQuality);
    if (floor.size < smallest.result.size || floor.size === smallest.result.size) {
      smallest = { quality: minQuality, result: floor };
    }
    options.onProgress?.(100);
    return {
      quality: smallest.quality,
      result: smallest.result,
      metTarget: smallest.result.size <= options.targetBytes,
      attempts: cache.size,
    };
  }

  options.onProgress?.(100);
  return {
    quality: bestUnder.quality,
    result: bestUnder.result,
    metTarget: true,
    attempts: cache.size,
  };
}
