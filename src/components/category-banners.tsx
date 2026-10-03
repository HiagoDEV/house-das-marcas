import Link from "next/link";
import Image from "next/image";

export type CategoryBanner = {
  id: string;
  name: string;
  slug: string;
  count: number;
  image: string | null;
};

export function CategoryBanners({ categories }: { categories: CategoryBanner[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/produtos?categoria=${cat.slug}`}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-surface-border bg-surface"
        >
          {cat.image ? (
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-colors duration-300 group-hover:from-black/90" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/0 transition-all duration-300 group-hover:ring-gold/60" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex items-end justify-between">
            <div>
              <p className="font-display text-lg md:text-2xl text-white tracking-tight transition-transform duration-300 group-hover:-translate-y-1">
                {cat.name}
              </p>
              <p className="text-white/70 text-xs mt-0.5">{cat.count} produtos</p>
            </div>
            <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white transition-all duration-300 group-hover:bg-gold group-hover:text-black group-hover:translate-x-0.5">
              <ArrowIcon />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
