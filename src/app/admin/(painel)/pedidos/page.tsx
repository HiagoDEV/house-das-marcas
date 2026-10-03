import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <p className="text-muted text-sm mt-1">{orders.length} pedido(s)</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-surface overflow-hidden">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-muted">
            Nenhum pedido recebido ainda. Quando um cliente finalizar uma compra, ele aparece aqui.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-surface-border">
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-surface-border/50">
                  <td className="py-3 px-4">
                    <div>{order.customerName}</div>
                    <div className="text-muted text-xs">{order.customerEmail}</div>
                  </td>
                  <td className="py-3 px-4 text-muted">
                    {order.createdAt.toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-3 px-4">{STATUS_LABEL[order.status] ?? order.status}</td>
                  <td className="py-3 px-4 text-right">{formatBRL(order.total.toString())}</td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/admin/pedidos/${order.id}`} className="text-gold hover:underline">
                      Ver detalhes
                    </Link>
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
