import { PageView } from "@/components/analytics/PageView";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileDock } from "@/components/layout/MobileDock";
import { AdSlot } from "@/components/ui/AdSlot";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <AdSlot position="top" />
      <main id="main" className="flex-1">
        {children}
      </main>
      <AdSlot position="bottom" />
      <Footer />
      <MobileDock />
      <PageView />
    </>
  );
}
