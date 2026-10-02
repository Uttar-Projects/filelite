import type { Metadata } from "next";
import { CategoryLanding } from "@/components/seo/CategoryLanding";
import { pageMetadata } from "@/lib/seo/metadata";
import { categoryById } from "@/lib/tools/categories";

const page = categoryById("image")!;
export const metadata: Metadata = pageMetadata(page);

export default function ImageToolsPage() {
  return <CategoryLanding categoryId="image" />;
}
