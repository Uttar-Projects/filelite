import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolsDashboard } from "@/components/tools/ToolsDashboard";
import { AdSlot } from "@/components/ui/AdSlot";
import { pageMetadata } from "@/lib/seo/metadata";
import { itemListSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";
import { availableTools, instrumentCount } from "@/lib/tools/catalog";

export const metadata: Metadata = pageMetadata({
  title: "Free Online Tools – Word Counter, JSON Formatter, Image Compressor",
  description: `Free online tools: word counter, JSON formatter, password generator, image compressor, and ${instrumentCount()} more. Private, in your browser, no sign-up.`,
  path: "/tools",
});

export default function ToolsPage() {
  const tools = availableTools();
  return (
    <>
      <JsonLd data={itemListSchema(tools.map((tool) => ({ name: tool.name, path: tool.href ?? "/tools" })))} />
      <Suspense>
        <ToolsDashboard />
      </Suspense>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-2">
        <AdSlot position="content" />
        <AdSlot position="bottom" />
      </div>
    </>
  );
}
