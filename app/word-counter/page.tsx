import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { WordCounterTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["word-counter"];
export const metadata: Metadata = pageMetadata(page);

export default function WordCounterPage() {
  return (
    <UtilityLanding slug="word-counter">
      <WordCounterTool />
    </UtilityLanding>
  );
}
