import { afterEach, describe, expect, it } from "vitest";
import { adsenseClient, getAdSlotId } from "@/lib/ads/slots";

const keys = [
  "NEXT_PUBLIC_ADS_ENABLED",
  "NEXT_PUBLIC_ADSENSE_CLIENT",
  "NEXT_PUBLIC_AD_SLOT_TOP",
  "NEXT_PUBLIC_AD_SLOT_CONTENT",
  "NEXT_PUBLIC_AD_SLOT_BOTTOM",
] as const;

afterEach(() => {
  for (const key of keys) delete process.env[key];
});

describe("ad slots", () => {
  it("stays off until AdSense is configured", () => {
    expect(adsenseClient()).toBeNull();
    expect(getAdSlotId("top")).toBeNull();
  });

  it("accepts a publisher id and numeric slot ids", () => {
    process.env.NEXT_PUBLIC_ADS_ENABLED = "true";
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = "ca-pub-1234567890";
    process.env.NEXT_PUBLIC_AD_SLOT_CONTENT = "9876543210";
    expect(adsenseClient()).toBe("ca-pub-1234567890");
    expect(getAdSlotId("content")).toBe("9876543210");
    expect(getAdSlotId("top")).toBeNull();
  });

  it("rejects a publisher id that is not a ca-pub value", () => {
    process.env.NEXT_PUBLIC_ADS_ENABLED = "true";
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = "not-a-client";
    process.env.NEXT_PUBLIC_AD_SLOT_TOP = "123";
    expect(adsenseClient()).toBeNull();
    expect(getAdSlotId("top")).toBeNull();
  });
});
