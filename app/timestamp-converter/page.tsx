import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { TimestampTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["timestamp-converter"];
export const metadata: Metadata = pageMetadata(page);

export default function TimestampConverterPage() {
  return (
    <UtilityLanding slug="timestamp-converter">
      <TimestampTool />
    </UtilityLanding>
  );
}
