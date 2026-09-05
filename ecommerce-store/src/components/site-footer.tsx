import Link from "next/link";

type FooterProps = {
  siteName: string;
  blurb?: string;
  copyright?: string;
  email?: string;
  pages: { title: string; slug: string; showInFooter?: boolean }[];
};

export function SiteFooter({ siteName, blurb, copyright, email, pages }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-[#e4d9cc] bg-[#efe6db]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-[#1c1915]">{siteName}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#5d5348]">{blurb}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#8a7d6e]">Pages</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/shop">Shop</Link>
            {pages
              .filter((page) => page.showInFooter !== false)
              .map((page) => (
                <Link key={page.slug} href={`/p/${page.slug}`}>
                  {page.title}
                </Link>
              ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#8a7d6e]">Studio</p>
          <p className="mt-4 text-sm text-[#5d5348]">{email}</p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex rounded-full bg-[#1c1915] px-4 py-2 text-sm text-[#f6f1ea]"
          >
            Admin dashboard
          </Link>
        </div>
      </div>
      <p className="border-t border-[#e4d9cc] px-4 py-4 text-center text-xs text-[#8a7d6e]">
        © {new Date().getFullYear()} {copyright}
      </p>
    </footer>
  );
}
