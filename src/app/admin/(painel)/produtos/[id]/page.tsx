import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProductAction } from "@/actions/products";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: { orderBy: { size: "asc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { position: "asc" } }),
  ]);

  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, product.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Editar produto</h1>
        <p className="text-muted text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm
        action={boundAction}
        categories={categories}
        submitLabel="Salvar alteracoes"
        product={{
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          active: product.active,
          categoryId: product.categoryId,
          sizes: product.variants.map((v) => v.size),
          images: product.images.map((img) => ({ id: img.id, url: img.url })),
        }}
      />
    </div>
  );
}
