import Link from "next/link";
import Image from "next/image";
import { formatBRL } from "@/lib/format";

export function ProductCard({
  product,
}: {
  product: {
    slug: string;
    name: string;
    price: string;
    category?: { name: string } | null;
    images: { url: string }[];
  };
}) {
  const image = product.images[0]?.url;

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group relative rounded-2xl border border-surface-border bg-surface overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)]"
    >
      <div className="aspect-square relative bg-black/20">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-xs">
            Sem foto
          </div>
        )}
        {product.category && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-[11px] text-white/90 tracking-wide">
            {product.category.name}
          </span>
        )}
      </div>
      <div className="p-3.5">
        <p className="text-sm text-foreground/90 line-clamp-1">{product.name}</p>
        <p className="text-gold font-semibold mt-1">{formatBRL(product.price)}</p>
      </div>
    </Link>
  );
}
