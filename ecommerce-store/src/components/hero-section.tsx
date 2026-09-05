import Link from "next/link";

type HeroProps = {
  hero: {
    enabled?: boolean;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    imageUrl?: string;
    overlay?: number;
  };
};

export function HeroSection({ hero }: HeroProps) {
  if (!hero?.enabled) return null;

  const overlay = Math.min(80, Math.max(0, hero.overlay ?? 40));

  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-[#1c1915] text-white">
      {hero.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hero.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div
        className="absolute inset-0 bg-[#1c1915]"
        style={{ opacity: overlay / 100 }}
      />
      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 py-20 md:max-w-3xl md:justify-center">
        {hero.eyebrow ? (
          <p className="text-xs uppercase tracking-[0.28em] text-[#e8d8c4]">{hero.eyebrow}</p>
        ) : null}
        <h1 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">{hero.title}</h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-[#f4eee6]/85">{hero.subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {hero.ctaText ? (
            <Link
              href={hero.ctaHref || "/shop"}
              className="rounded-full bg-[#f6f1ea] px-6 py-3 text-sm text-[#1c1915]"
            >
              {hero.ctaText}
            </Link>
          ) : null}
          {hero.secondaryCtaText ? (
            <Link
              href={hero.secondaryCtaHref || "/p/about"}
              className="rounded-full border border-white/40 px-6 py-3 text-sm"
            >
              {hero.secondaryCtaText}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
