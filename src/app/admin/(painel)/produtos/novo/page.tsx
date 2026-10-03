import { prisma } from "@/lib/prisma";
import { createProductAction } from "@/actions/products";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { position: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Novo produto</h1>
        <p className="text-muted text-sm mt-1">Cadastre um item para aparecer na loja</p>
      </div>
      <ProductForm action={createProductAction} categories={categories} submitLabel="Cadastrar produto" />
    </div>
  );
}
