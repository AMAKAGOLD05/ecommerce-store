import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { emptySettings } from "@/lib/data";
import { getPublishedPages, getSettings, type SerializedSettings } from "@/lib/store";
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

  let settings: SerializedSettings = emptySettings();
  let pages: { title: string; slug: string; showInFooter?: boolean }[] = [];

  try {
    settings = await getSettings();
    pages = await getPublishedPages();
  } catch {
    settings = emptySettings();
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
