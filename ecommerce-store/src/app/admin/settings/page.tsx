"use client";

import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/image-upload";

type Settings = Record<string, unknown> & {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  announcement: { enabled: boolean; text: string };
  hero: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
    imageUrl: string;
    overlay: number;
  };
  featured: { heading: string; subheading: string };
  newsletter: { heading: string; subheading: string };
  contact: { email: string; phone: string; address: string };
  social: { instagram: string; twitter: string };
  footer: { blurb: string; copyright: string };
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((response) => response.json())
      .then((payload) => setSettings(payload.settings));
  }, []);

  if (!settings) return <p>Loading site settings...</p>;

  function patch<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((current) => (current ? { ...current, [key]: value } : current));
  }

  return (
    <form
      className="max-w-3xl space-y-10"
      onSubmit={async (event) => {
        event.preventDefault();
        const response = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
        setMessage(response.ok ? "Website settings saved." : "Could not save settings.");
      }}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#8a7d6e]">Website</p>
        <h1 className="mt-2 font-serif text-4xl">Site settings</h1>
        <p className="mt-3 text-[#5d5348]">
          Control the logo, hero, announcement bar, and footer used across the storefront.
        </p>
      </div>

      <section className="space-y-4 rounded-3xl bg-white p-6">
        <h2 className="font-serif text-2xl">Brand & logo</h2>
        <input
          value={settings.siteName}
          onChange={(event) => patch("siteName", event.target.value)}
          className="w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
          placeholder="Store name"
        />
        <input
          value={settings.tagline}
          onChange={(event) => patch("tagline", event.target.value)}
          className="w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
          placeholder="Tagline"
        />
        <ImageUpload
          label="Logo"
          hint="Upload a transparent PNG or SVG. This replaces the store name in the header."
          value={settings.logoUrl}
          onChange={(url) => patch("logoUrl", url)}
        />
        <ImageUpload
          label="Favicon"
          value={settings.faviconUrl}
          onChange={(url) => patch("faviconUrl", url)}
        />
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-6">
        <h2 className="font-serif text-2xl">Announcement bar</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.announcement.enabled}
            onChange={(event) =>
              patch("announcement", { ...settings.announcement, enabled: event.target.checked })
            }
          />
          Show announcement
        </label>
        <input
          value={settings.announcement.text}
          onChange={(event) =>
            patch("announcement", { ...settings.announcement, text: event.target.value })
          }
          className="w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
        />
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-6">
        <h2 className="font-serif text-2xl">Hero section</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.hero.enabled}
            onChange={(event) => patch("hero", { ...settings.hero, enabled: event.target.checked })}
          />
          Show hero on homepage
        </label>
        <ImageUpload
          label="Hero image"
          hint="Upload a wide landscape photo for the homepage hero."
          value={settings.hero.imageUrl}
          onChange={(url) => patch("hero", { ...settings.hero, imageUrl: url })}
        />
        <input
          value={settings.hero.eyebrow}
          onChange={(event) => patch("hero", { ...settings.hero, eyebrow: event.target.value })}
          className="w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
          placeholder="Eyebrow"
        />
        <input
          value={settings.hero.title}
          onChange={(event) => patch("hero", { ...settings.hero, title: event.target.value })}
          className="w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
          placeholder="Hero title"
        />
        <textarea
          value={settings.hero.subtitle}
          onChange={(event) => patch("hero", { ...settings.hero, subtitle: event.target.value })}
          className="h-28 w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
          placeholder="Subtitle"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={settings.hero.ctaText}
            onChange={(event) => patch("hero", { ...settings.hero, ctaText: event.target.value })}
            className="rounded-xl border border-[#d8cbbb] px-4 py-3"
            placeholder="Primary button"
          />
          <input
            value={settings.hero.ctaHref}
            onChange={(event) => patch("hero", { ...settings.hero, ctaHref: event.target.value })}
            className="rounded-xl border border-[#d8cbbb] px-4 py-3"
            placeholder="/shop"
          />
          <input
            value={settings.hero.secondaryCtaText}
            onChange={(event) =>
              patch("hero", { ...settings.hero, secondaryCtaText: event.target.value })
            }
            className="rounded-xl border border-[#d8cbbb] px-4 py-3"
            placeholder="Secondary button"
          />
          <input
            value={settings.hero.secondaryCtaHref}
            onChange={(event) =>
              patch("hero", { ...settings.hero, secondaryCtaHref: event.target.value })
            }
            className="rounded-xl border border-[#d8cbbb] px-4 py-3"
            placeholder="/p/about"
          />
        </div>
        <label className="block text-sm">
          Overlay {settings.hero.overlay}%
          <input
            type="range"
            min={0}
            max={80}
            value={settings.hero.overlay}
            onChange={(event) =>
              patch("hero", { ...settings.hero, overlay: Number(event.target.value) })
            }
            className="mt-2 w-full"
          />
        </label>
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-6">
        <h2 className="font-serif text-2xl">Homepage sections</h2>
        <input
          value={settings.featured.heading}
          onChange={(event) => patch("featured", { ...settings.featured, heading: event.target.value })}
          className="w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
          placeholder="Featured heading"
        />
        <input
          value={settings.featured.subheading}
          onChange={(event) =>
            patch("featured", { ...settings.featured, subheading: event.target.value })
          }
          className="w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
          placeholder="Featured subheading"
        />
        <input
          value={settings.newsletter.heading}
          onChange={(event) =>
            patch("newsletter", { ...settings.newsletter, heading: event.target.value })
          }
          className="w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
          placeholder="Newsletter heading"
        />
        <input
          value={settings.newsletter.subheading}
          onChange={(event) =>
            patch("newsletter", { ...settings.newsletter, subheading: event.target.value })
          }
          className="w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
          placeholder="Newsletter subheading"
        />
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-6">
        <h2 className="font-serif text-2xl">Contact & footer</h2>
        <input
          value={settings.contact.email}
          onChange={(event) => patch("contact", { ...settings.contact, email: event.target.value })}
          className="w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
          placeholder="Email"
        />
        <input
          value={settings.contact.phone}
          onChange={(event) => patch("contact", { ...settings.contact, phone: event.target.value })}
          className="w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
          placeholder="Phone"
        />
        <input
          value={settings.contact.address}
          onChange={(event) => patch("contact", { ...settings.contact, address: event.target.value })}
          className="w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
          placeholder="Address"
        />
        <textarea
          value={settings.footer.blurb}
          onChange={(event) => patch("footer", { ...settings.footer, blurb: event.target.value })}
          className="h-24 w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
        />
        <input
          value={settings.footer.copyright}
          onChange={(event) => patch("footer", { ...settings.footer, copyright: event.target.value })}
          className="w-full rounded-xl border border-[#d8cbbb] px-4 py-3"
        />
      </section>

      <button className="rounded-full bg-[#1c1915] px-6 py-3 text-sm text-white">Save website</button>
      {message ? <p className="text-sm text-[#5d5348]">{message}</p> : null}
    </form>
  );
}
