import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} – free online tools`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#050505",
          color: "#f5f5f5",
        }}
      >
        <div style={{ fontSize: 28, color: "#ff6a00", fontWeight: 600 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 64, fontWeight: 600, marginTop: 20, lineHeight: 1.1 }}>
          The workshop of underrated tools.
        </div>
        <div style={{ fontSize: 26, marginTop: 24, color: "#9a9a9a", maxWidth: 800 }}>
          Compress images, convert text, format JSON, and more in your browser.
        </div>
      </div>
    ),
    size,
  );
}
