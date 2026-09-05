"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PageItem = {
  _id: string;
  title: string;
  slug: string;
  published: boolean;
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);

  async function load() {
    const response = await fetch("/api/pages?all=1");
    const payload = await response.json();
    setPages(payload.pages || []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#8a7d6e]">Content</p>
          <h1 className="mt-2 font-serif text-4xl">Pages</h1>
        </div>
        <Link href="/admin/pages/new" className="rounded-full bg-[#1c1915] px-5 py-2 text-sm text-white">
          New page
        </Link>
      </div>
      <div className="mt-8 overflow-hidden rounded-3xl bg-white">
        {pages.map((page) => (
          <div key={page._id} className="flex items-center justify-between border-b border-[#efe6db] px-5 py-4">
            <div>
              <p className="font-medium">{page.title}</p>
              <p className="text-sm text-[#8a7d6e]">/p/{page.slug} · {page.published ? "Published" : "Draft"}</p>
            </div>
            <div className="flex gap-4 text-sm">
              <Link href={`/p/${page.slug}`} className="underline">
                View
              </Link>
              <Link href={`/admin/pages/${page._id}`} className="underline">
                Edit
              </Link>
              <button
                type="button"
                className="underline"
                onClick={async () => {
                  if (!confirm("Delete this page?")) return;
                  await fetch(`/api/pages/${page._id}`, { method: "DELETE" });
                  load();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
