import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedPages, getSettings } from "@/lib/store";
import { seedStore } from "@/lib/seed";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await seedStore();
  } catch {
    // Store still renders if MongoDB is offline; pages can show empty states.
  }

  let settings;
  let pages: { title: string; slug: string; showInFooter?: boolean }[] = [];

  try {
    settings = await getSettings();
    pages = await getPublishedPages();
  } catch {
    settings = {
      siteName: "Lumen Lagos",
      logoUrl: "",
      announcement: { enabled: true, text: "Free nationwide shipping on orders over ₦80,000." },
      footer: { blurb: "A Lagos shop for Nigerian makers.", copyright: "Lumen Lagos." },
      contact: { email: "hello@lumen.ng" },
    };
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader
        siteName={settings.siteName}
        logoUrl={settings.logoUrl}
        announcement={settings.announcement}
        pages={pages}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        siteName={settings.siteName}
        blurb={settings.footer?.blurb}
        copyright={settings.footer?.copyright}
        email={settings.contact?.email}
        pages={pages}
      />
    </div>
  );
}
