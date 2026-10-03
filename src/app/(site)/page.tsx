import { Bike, Truck, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { HeroCarousel, type HeroSlide } from "@/components/hero-carousel";
import { CategoryBanners, type CategoryBanner } from "@/components/category-banners";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

// fotos reais com boa composicao para o banner cheio (modelos / lifestyle);
// fotos de still em fundo branco ficam melhores no grid, nao no banner
const HERO_SLUGS = [
  "polo-hiatto-preto",
  "polo-com-bolso-verde",
  "tenis-couro-marrom-ziper",
  "polo-piquet-cinza-mescla",
  "tenis-casual-couro-marrom",
];

export default async function Home() {
  const [categories, heroProductsRaw, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { position: "asc" },
      include: {
        _count: { select: { products: true } },
        products: {
          where: { active: true },
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { images: { orderBy: { position: "asc" }, take: 1 } },
        },
      },
    }),
    prisma.product.findMany({
      where: { active: true, slug: { in: HERO_SLUGS } },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
    }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        category: { select: { name: true } },
      },
    }),
  ]);

  const heroProducts =
    heroProductsRaw.length > 0
      ? HERO_SLUGS.map((slug) => heroProductsRaw.find((p) => p.slug === slug)).filter(
          (p): p is (typeof heroProductsRaw)[number] => Boolean(p)
        )
      : products.slice(0, 5);

  const slides: HeroSlide[] = heroProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price.toString(),
    image: p.images[0]?.url ?? null,
  }));

  const categoryBanners: CategoryBanner[] = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    count: cat._count.products,
    image: cat.products[0]?.images[0]?.url ?? null,
  }));

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 pt-8 md:pt-12">
        <HeroCarousel slides={slides} />
      </section>

      <Reveal>
        <section className="max-w-6xl mx-auto px-4 py-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted">
          <span className="flex items-center gap-2">
            <Bike className="w-4 h-4 text-gold" strokeWidth={1.75} />
            Entrega por motoboy em Sao Jose dos Campos
          </span>
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gold" strokeWidth={1.75} />
            Envio para todo o Brasil
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold" strokeWidth={1.75} />
            Compra segura
          </span>
        </section>
      </Reveal>

      {categoryBanners.length > 0 && (
        <Reveal>
          <section className="max-w-6xl mx-auto px-4 pb-16">
            <h2 className="font-display text-2xl tracking-tight mb-5">Compre por categoria</h2>
            <CategoryBanners categories={categoryBanners} />
          </section>
        </Reveal>
      )}

      <Reveal>
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="font-display text-2xl tracking-tight mb-5">Novidades</h2>
          {products.length === 0 ? (
            <p className="text-muted text-sm">Em breve novos produtos.</p>
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
        </section>
      </Reveal>
    </div>
  );
}
