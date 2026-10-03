import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";
import { AddToCart } from "@/components/add-to-cart";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, active: true },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { size: "asc" } },
      category: true,
    },
  });

  if (!product) notFound();

  const mainImage = product.images[0]?.url ?? null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 md:py-14 grid md:grid-cols-2 gap-10 md:gap-14">
      <div className="space-y-3">
        <div className="aspect-square relative bg-surface rounded-2xl overflow-hidden border border-surface-border">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">
              Sem foto
            </div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.slice(1).map((img) => (
              <div
                key={img.id}
                className="w-16 h-16 relative rounded-lg overflow-hidden border border-surface-border"
              >
                <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {product.category && (
          <span className="inline-block rounded-full border border-surface-border px-3 py-1 text-xs text-muted">
            {product.category.name}
          </span>
        )}
        <h1 className="font-display text-3xl md:text-4xl tracking-tight mt-4">{product.name}</h1>
        <p className="text-2xl text-gold font-semibold mt-3">
          {formatBRL(product.price.toString())}
        </p>

        {product.description && (
          <p className="text-muted text-sm mt-4 leading-relaxed max-w-[60ch]">
            {product.description}
          </p>
        )}

        <AddToCart
          productId={product.id}
          name={product.name}
          price={Number(product.price)}
          image={mainImage}
          variants={product.variants}
        />

        <div className="mt-8 rounded-xl border border-surface-border bg-surface p-4 text-sm text-muted">
          Entrega por motoboy em Sao Jose dos Campos ou envio para todo o Brasil.
        </div>
      </div>
    </div>
  );
}
