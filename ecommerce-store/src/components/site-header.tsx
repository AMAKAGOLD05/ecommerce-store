"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

type HeaderProps = {
  siteName: string;
  logoUrl?: string;
  announcement?: { enabled?: boolean; text?: string };
  pages: { title: string; slug: string }[];
};

export function SiteHeader({ siteName, logoUrl, announcement, pages }: HeaderProps) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#f6f1ea]/90 backdrop-blur">
      {announcement?.enabled && announcement.text ? (
        <p className="border-b border-[#e4d9cc] px-4 py-2 text-center text-xs tracking-[0.18em] uppercase text-[#5d5348]">
          {announcement.text}
        </p>
      ) : null}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} className="h-10 w-auto object-contain" />
          ) : (
            <span className="font-serif text-2xl tracking-tight text-[#1c1915]">{siteName}</span>
          )}
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-[#3d3831] md:flex">
          <Link href="/shop" className="hover:text-[#1c1915]">
            Shop
          </Link>
          {pages.slice(0, 4).map((page) => (
            <Link key={page.slug} href={`/p/${page.slug}`} className="hover:text-[#1c1915]">
              {page.title}
            </Link>
          ))}
          <Link href="/cart" className="rounded-full border border-[#d8cbbb] px-4 py-2">
            Bag {count}
          </Link>
          <Link href="/admin/login" className="rounded-full bg-[#1c1915] px-4 py-2 text-[#f6f1ea]">
            Dashboard
          </Link>
        </nav>
        <button
          type="button"
          className="rounded-full border border-[#d8cbbb] px-4 py-2 text-sm md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>
      {open ? (
        <div className="flex flex-col gap-3 border-t border-[#e4d9cc] px-4 py-4 text-sm md:hidden">
          <Link href="/shop" onClick={() => setOpen(false)}>
            Shop
          </Link>
          {pages.map((page) => (
            <Link key={page.slug} href={`/p/${page.slug}`} onClick={() => setOpen(false)}>
              {page.title}
            </Link>
          ))}
          <Link href="/cart" onClick={() => setOpen(false)}>
            Bag {count}
          </Link>
          <Link href="/admin/login" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
        </div>
      ) : null}
    </header>
  );
}
