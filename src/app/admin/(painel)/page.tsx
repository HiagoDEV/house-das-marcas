import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [productCount, activeCount, categoryCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.category.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });

  const stats = [
    { label: "Produtos cadastrados", value: productCount },
    { label: "Produtos ativos na loja", value: activeCount },
    { label: "Categorias", value: categoryCount },
    { label: "Pedidos pendentes", value: pendingOrders },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Visao geral da loja</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-surface-border bg-surface p-5"
          >
            <p className="text-3xl font-semibold text-gold">{stat.value}</p>
            <p className="text-sm text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-surface-border bg-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">Ultimos pedidos</h2>
          <Link href="/admin/pedidos" className="text-sm text-gold hover:underline">
            Ver todos
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-muted">
            Nenhum pedido ainda. Assim que a loja comecar a vender, os pedidos aparecem aqui.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-surface-border">
                <th className="py-2">Cliente</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-surface-border/50">
                  <td className="py-2">{order.customerName}</td>
                  <td className="py-2">{order.status}</td>
                  <td className="py-2 text-right">{formatBRL(order.total.toString())}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/produtos/novo"
          className="rounded-lg bg-gold text-black font-medium px-4 py-2 text-sm hover:brightness-110 transition"
        >
          + Cadastrar produto
        </Link>
      </div>
    </div>
  );
}
