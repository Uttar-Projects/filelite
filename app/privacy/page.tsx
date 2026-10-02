import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles images, text, analytics, and ordinary page requests. Tools run in your browser.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container className="max-w-3xl py-12">
      <h1 className="text-4xl">Privacy</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
        <p>
          Images, pasted text, JSON, colors, and other inputs are processed locally in your browser whenever possible
          and are not uploaded to our servers for normal use. The compressor, resizer, converter, comparison preview,
          single download, ZIP download, and the text and developer tools all run on your device.
        </p>
        <p>
          Loading the website still requests HTML, CSS, and JavaScript from the host, the same way any site does.
          That request does not include the pictures you add to the tool. {siteConfig.name} does not keep a copy of
          those pictures, because the processing path never receives them.
        </p>
        <p>
          Analytics is off unless <code>NEXT_PUBLIC_ANALYTICS_ENABLED</code> is set. When it is enabled, the app can
          record event names such as upload started, compression completed, or download clicked, along with details
          like format and quality. It does not send image contents, file names, or the pixels themselves.
        </p>
        <p>
          The contact form does not post to a {siteConfig.name} server. If a contact email is configured, your browser
          opens a mail draft. If it is not configured, you can copy the message locally.
        </p>
        <p>
          HEIC and AVIF depend on the browser you are using. If a format cannot be decoded or encoded, the page says
          so. Nothing is sent elsewhere to finish the job.
        </p>
      </div>
    </Container>
  );
}
