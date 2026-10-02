export const analyticsEvents = [
  "page_view",
  "upload_started",
  "compression_started",
  "compression_completed",
  "compression_failed",
  "download_clicked",
  "batch_download",
  "format_conversion",
  "target_size_used",
] as const;

export type AnalyticsEventName = (typeof analyticsEvents)[number];
export type AnalyticsProperties = Record<string, string | number | boolean>;

export type AnalyticsProvider = {
  track: (event: AnalyticsEventName, properties: AnalyticsProperties) => void;
};

const providers: AnalyticsProvider[] = [];
let debugRegistered = false;

export function analyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";
}

export function registerAnalyticsProvider(provider: AnalyticsProvider): void {
  providers.push(provider);
}

function registerDebugProvider(): void {
  if (debugRegistered || process.env.NEXT_PUBLIC_ANALYTICS_DEBUG !== "true") return;
  debugRegistered = true;
  registerAnalyticsProvider({
    track: (event, properties) => {
      console.info("[analytics]", event, properties);
    },
  });
}

export function track(event: AnalyticsEventName, properties: AnalyticsProperties = {}): void {
  if (!analyticsEnabled()) return;
  registerDebugProvider();
  for (const provider of providers) {
    try {
      provider.track(event, properties);
    } catch {
      // Analytics must never interrupt compression.
    }
  }
}
