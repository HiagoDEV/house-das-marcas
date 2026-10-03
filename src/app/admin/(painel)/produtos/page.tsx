import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";
import { ProductRowActions } from "./product-row-actions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Produtos</h1>
          <p className="text-muted text-sm mt-1">{products.length} produto(s) cadastrado(s)</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="rounded-lg bg-gold text-black font-medium px-4 py-2 text-sm hover:brightness-110 transition"
        >
          + Novo produto
        </Link>
      </div>

      <div className="rounded-xl border border-surface-border bg-surface overflow-hidden">
        {products.length === 0 ? (
          <p className="p-6 text-sm text-muted">
            Nenhum produto cadastrado ainda. Clique em &quot;Novo produto&quot; para comecar.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-surface-border">
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Preco</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-surface-border/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-black/40 overflow-hidden shrink-0 relative">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted">{product.category?.name ?? "-"}</td>
                  <td className="py-3 px-4">{formatBRL(product.price.toString())}</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        product.active
                          ? "text-emerald-400 text-xs uppercase tracking-wide"
                          : "text-muted text-xs uppercase tracking-wide"
                      }
                    >
                      {product.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <ProductRowActions productId={product.id} active={product.active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
