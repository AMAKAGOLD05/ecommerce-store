import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/data";

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <article>
      {page.coverImage ? (
        <div className="h-[46vh] overflow-hidden bg-[#1c1915]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={page.coverImage} alt="" className="h-full w-full object-cover opacity-90" />
        </div>
      ) : null}
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8a7d6e]">Page</p>
        <h1 className="mt-3 font-serif text-5xl">{page.title}</h1>
        {page.excerpt ? <p className="mt-4 text-lg text-[#5d5348]">{page.excerpt}</p> : null}
        <div className="mt-8 space-y-5 whitespace-pre-line leading-7 text-[#3d3831]">{page.content}</div>
      </div>
    </article>
  );
}
