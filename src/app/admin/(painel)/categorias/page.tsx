import { prisma } from "@/lib/prisma";
import { createCategoryAction, deleteCategoryAction } from "@/actions/categories";
import { DeleteCategoryButton } from "./delete-category-button";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Categorias</h1>
        <p className="text-muted text-sm mt-1">Organize os produtos por categoria</p>
      </div>

      <form action={createCategoryAction} className="flex gap-3 max-w-md">
        <input
          name="name"
          placeholder="Nome da categoria"
          required
          className="flex-1 rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
        />
        <button
          type="submit"
          className="rounded-lg bg-gold text-black font-medium px-4 py-2 text-sm hover:brightness-110 transition"
        >
          Adicionar
        </button>
      </form>

      <div className="rounded-xl border border-surface-border bg-surface overflow-hidden max-w-md">
        {categories.length === 0 ? (
          <p className="p-6 text-sm text-muted">Nenhuma categoria cadastrada.</p>
        ) : (
          <ul>
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between px-4 py-3 border-b border-surface-border/50 text-sm"
              >
                <span>
                  {cat.name}{" "}
                  <span className="text-muted">({cat._count.products} produtos)</span>
                </span>
                <DeleteCategoryButton
                  categoryId={cat.id}
                  action={deleteCategoryAction}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
