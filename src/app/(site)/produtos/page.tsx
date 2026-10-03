import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { position: "asc" } }),
    prisma.product.findMany({
      where: {
        active: true,
        category: categoria ? { slug: categoria } : undefined,
      },
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        category: { select: { name: true } },
      },
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
      <h1 className="font-display text-3xl tracking-tight mb-7">Produtos</h1>

      <div className="flex gap-2 flex-wrap mb-8">
        <Link
          href="/produtos"
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            !categoria
              ? "border-gold text-gold"
              : "border-surface-border text-foreground/80 hover:border-gold hover:text-gold"
          }`}
        >
          Todos
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/produtos?categoria=${cat.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              categoria === cat.slug
                ? "border-gold text-gold"
                : "border-surface-border text-foreground/80 hover:border-gold hover:text-gold"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-muted text-sm">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{ ...product, price: product.price.toString() }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
