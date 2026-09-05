"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/sales", label: "Sales" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/pages", label: "Pages" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-full bg-[#f3eee7] md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-[#e4d9cc] bg-[#efe6db] px-5 py-6 md:border-b-0 md:border-r">
        <Link href="/" className="font-serif text-2xl">
          Lumen Lagos
        </Link>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8a7d6e]">Dashboard</p>
        <nav className="mt-8 flex flex-col gap-2 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-3 py-2 ${
                pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
                  ? "bg-[#1c1915] text-white"
                  : "hover:bg-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="mt-10 text-sm underline"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/admin/login");
            router.refresh();
          }}
        >
          Sign out
        </button>
      </aside>
      <div className="px-4 py-8 md:px-10">{children}</div>
    </div>
  );
}
