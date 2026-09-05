"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";

type PageValues = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  showInFooter: boolean;
  seoTitle: string;
  seoDescription: string;
};

const emptyPage: PageValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  published: true,
  showInFooter: true,
  seoTitle: "",
  seoDescription: "",
};

export function PageForm({ initial }: { initial?: PageValues }) {
  const router = useRouter();
  const [values, setValues] = useState<PageValues>(initial || emptyPage);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update<K extends keyof PageValues>(key: K, value: PageValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const endpoint = values._id ? `/api/pages/${values._id}` : "/api/pages";
    const response = await fetch(endpoint, {
      method: values._id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(payload.error || "Could not save page.");
      return;
    }
    router.push("/admin/pages");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4">
      <input
        required
        value={values.title}
        onChange={(event) => update("title", event.target.value)}
        placeholder="Page title"
        className="w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
      />
      <input
        value={values.slug}
        onChange={(event) => update("slug", event.target.value)}
        placeholder="Slug"
        className="w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
      />
      <input
        value={values.excerpt}
        onChange={(event) => update("excerpt", event.target.value)}
        placeholder="Short excerpt"
        className="w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
      />
      <ImageUpload
        label="Cover image"
        hint="Optional hero image for this page."
        value={values.coverImage}
        onChange={(url) => update("coverImage", url)}
      />
      <textarea
        value={values.content}
        onChange={(event) => update("content", event.target.value)}
        placeholder="Page content"
        className="h-56 w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
      />
      <input
        value={values.seoTitle}
        onChange={(event) => update("seoTitle", event.target.value)}
        placeholder="SEO title"
        className="w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
      />
      <input
        value={values.seoDescription}
        onChange={(event) => update("seoDescription", event.target.value)}
        placeholder="SEO description"
        className="w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={values.published} onChange={(event) => update("published", event.target.checked)} />
        Published
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.showInFooter}
          onChange={(event) => update("showInFooter", event.target.checked)}
        />
        Show in header and footer
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button disabled={busy} className="rounded-full bg-[#1c1915] px-6 py-3 text-sm text-white">
        {busy ? "Saving..." : "Save page"}
      </button>
    </form>
  );
}
